import { percentToVolume, PulseAudio } from 'pulseaudio-js'
import type { CompanionActionDefinition } from '@companion-module/base'

import type { PulseAudioSource, SourceParams, VolumeParams } from '../models/index.js'
import { generateSourceDropdown, volumePercentageOption } from '../options/index.js'
import { applyToMatches, standardAction } from './standardAction.js'

const setVolumeSources = (client: PulseAudio, sources: PulseAudioSource[]): CompanionActionDefinition =>
	standardAction<SourceParams & VolumeParams>({
		name: 'Set Volume for Sources',
		options: [volumePercentageOption, generateSourceDropdown(sources)],
		onEvent: async ({ sourceIDs, volumePercentage }) => {
			const resolvedVolume = Number(volumePercentage)
			return applyToMatches(
				sources,
				({ name }) => name,
				sourceIDs,
				async ({ volume, name }: PulseAudioSource) => {
					const newVolume = volume.current.map(() => percentToVolume(resolvedVolume))
					return client.setSourceVolume(newVolume, name)
				},
			)
		},
	})

export default setVolumeSources
