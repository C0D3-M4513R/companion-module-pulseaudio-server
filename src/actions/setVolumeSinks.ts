import { percentToVolume, PulseAudio } from 'pulseaudio.js'
import type { CompanionActionDefinition } from '@companion-module/base'

import type { PulseAudioSink, SinkParams, VolumeParams } from '../models/index.js'
import { generateSinkDropdown, volumePercentageOption } from '../options/index.js'
import { applyToMatches, standardAction } from './standardAction.js'

const setVolumeSinks = (client: PulseAudio, sinks: PulseAudioSink[]): CompanionActionDefinition =>
	standardAction<SinkParams & VolumeParams>({
		name: 'Set Volume for Sinks',
		options: [volumePercentageOption, generateSinkDropdown(sinks)],
		onEvent: async ({ sinkIDs, volumePercentage }) => {
			const resolvedVolume = Number(volumePercentage)
			return applyToMatches(
				sinks,
				({ name }) => name,
				sinkIDs,
				async ({ volume, name }: PulseAudioSink) => {
					const newVolume = volume.current.map(() => percentToVolume(resolvedVolume))
					return client.setSinkVolume(newVolume, name)
				},
			)
		},
	})

export default setVolumeSinks
