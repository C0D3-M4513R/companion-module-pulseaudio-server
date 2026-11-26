import { PulseAudio } from 'pulseaudio.js'
import { InstanceBase, InstanceStatus, InstanceTypes, LogLevel, SomeCompanionConfigField } from '@companion-module/base'

import { ModuleConfig, configFields } from './models/index.js'
import { variableDefinitions } from './variables.js'
import generateActions from './actions/index.js'
import generateFeedbacks from './feedbacks/index.js'
import presets from './presets/index.js'
import { clientForConfig, getSinks, getSources, getSinkInputs } from './driver.js'

type Logger = {
	debug: (...messages: unknown[]) => void
	info: (...messages: unknown[]) => void
	warn: (...messages: unknown[]) => void
	error: (...messages: unknown[]) => void
}

type ModuleSchema = InstanceTypes & { config: ModuleConfig }

class PulseAudioModuleInstance extends InstanceBase<ModuleSchema> {
	private client?: PulseAudio

	constructor(internal: unknown) {
		super(internal)
	}

	getLogger(): Logger {
		const formatMessages = (messages: unknown[]) => messages.join('\n')
		const logMessage =
			(logLevel: LogLevel) =>
			(...messages: unknown[]) =>
				this.log(logLevel, formatMessages(messages))
		return {
			debug: logMessage('debug'),
			info: logMessage('info'),
			warn: logMessage('warn'),
			error: logMessage('error'),
		}
	}
	async reloadState(): Promise<void> {
		const log = this.getLogger()
		if (this.client) {
			log.info('Reloading state from client')
			const [sources, sinks, sinkInputs] = await Promise.all([
				getSources(this.client),
				getSinks(this.client),
				getSinkInputs(this.client),
			])

			log.debug('Adding custom variables to companion')
			this.setVariableDefinitions(variableDefinitions)

			log.debug('Adding custom actions to companion')
			const actions = generateActions(this.client, sources, sinks, sinkInputs)
			this.setActionDefinitions(actions)

			log.debug('Adding custom feedbackcs to companion')
			const feedbacks = generateFeedbacks(sources, sinks, sinkInputs)
			this.setFeedbackDefinitions(feedbacks)

			log.debug('Adding custom presets to companion')
			const presetStructure = [
				{
					id: 'presets',
					name: 'Presets',
					definitions: [
						{
							id: 'group',
							name: 'Presets',
							description: 'PulseAudio presets',
							type: 'simple' as const,
							presets: Object.keys(presets),
						},
					],
				},
			]
			this.setPresetDefinitions(presetStructure, presets)

			log.debug('Checking feedbacks')
			this.checkFeedbacksById()
		}
	}

	async init(config: ModuleConfig): Promise<void> {
		const log = this.getLogger()
		try {
			log.info('Starting PulseAudio module')
			await this.configUpdated(config)
			log.info('PulseAudio Module Started')
		} catch (err: unknown) {
			log.error('Error in PulseAudio init', err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err))
		}
	}

	async destroy(): Promise<void> {
		const log = this.getLogger()
		log.info('Disconnecting from PulseAudio')
		try {
			await this.client?.disconnect()
		} catch (err: unknown) {
			log.warn(
				'Error while disconnecting from PulseAudio',
				err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err),
			)
		}
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		const log = this.getLogger()
		log.info('Config Change Detected')
		try {
			log.debug('Setting Instance Status to Disconnected')
			this.updateStatus(InstanceStatus.Disconnected)
			log.debug('Generating client for config')
			this.client = clientForConfig(config)
			this.client.on('error', (err: unknown) =>
				log.error(
					'Error from PulseAudio.js',
					err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err),
				),
			)
			log.debug('Setting Instance Status to Connecting')
			this.updateStatus(InstanceStatus.Connecting)
			log.debug('Attempting to connect')
			await this.client.connect()
			log.info('Connect Successful!')
			log.debug('Registering event handlers')
			this.client.on('event.source', () => {
				log.info('Reloading for Source Event')
				this.reloadState().catch((err: unknown) => log.error('Error in source event handler', err))
			})
			this.client.on('event.sink', () => {
				log.info('Reloading for Sink Event')
				this.reloadState().catch((err: unknown) => log.error('Error in sink event handler', err))
			})
			this.client.on('event.sink_input', () => {
				log.info('Reloading for Sink Input Event')
				this.reloadState().catch((err: unknown) => log.error('Error in sink input event handler', err))
			})
			await this.reloadState()
			log.debug('Setting Instance Status to OK')
			this.updateStatus(InstanceStatus.Ok)
		} catch (err: unknown) {
			log.error(
				'Unable to connect to PulseAudio',
				err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err),
			)
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return configFields
	}
}

export default PulseAudioModuleInstance
