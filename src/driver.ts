import fs from 'fs'

import { PulseAudio } from 'pulseaudio-js'

import type { ModuleConfig, PulseAudioSink, PulseAudioSinkInput, PulseAudioSource } from './models/index.js'

export const clientForConfig = ({ cookie, sockPath }: ModuleConfig): PulseAudio => {
	let cookieBuffer: Buffer | undefined
	if (cookie && cookie.length > 0) {
		// `cookie` is configured as an absolute path to the authentication
		// cookie file, not the raw cookie bytes.
		try {
			cookieBuffer = fs.readFileSync(cookie)
		} catch (err) {
			throw new Error(
				`Unable to read PulseAudio authentication cookie at '${cookie}': ${err instanceof Error ? err.message : String(err)}`,
				{ cause: err },
			)
		}
	}
	return new PulseAudio(undefined, cookieBuffer, sockPath || undefined)
}

export const getSources = async (client: PulseAudio): Promise<PulseAudioSource[]> => {
	const sources = await client.getAllSources()
	const simplifiedSources: PulseAudioSource[] = sources.map((record) => ({
		name: record.name as string,
		index: record.index as number,
		description: record.description as string,
		mute: record.mute as boolean,
		volume: record.volume as { current: number[]; base: number; steps: number },
	}))
	return simplifiedSources
}

export const getSinks = async (client: PulseAudio): Promise<PulseAudioSink[]> => {
	const sinks = await client.getAllSinks()
	const simplifiedSinks: PulseAudioSink[] = sinks.map((record) => ({
		name: record.name as string,
		index: record.index as number,
		description: record.description as string,
		mute: record.mute as boolean,
		volume: record.volume as { current: number[]; base: number; steps: number },
	}))
	return simplifiedSinks
}

export const getSinkInputs = async (client: PulseAudio): Promise<PulseAudioSinkInput[]> => {
	const list = await client.getSinkInputList()
	const sinkInputs = list.map(
		(sinkInput) =>
			({
				...sinkInput,
			}) as PulseAudioSinkInput,
	)
	return sinkInputs
}
