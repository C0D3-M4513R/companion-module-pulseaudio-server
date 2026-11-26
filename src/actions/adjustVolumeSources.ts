import { percentToVolume, volumeToPercent, PulseAudio } from 'pulseaudio.js'
import type { CompanionActionDefinition } from '@companion-module/base'

import type { PulseAudioSource, SourceParams, VolumeAdjustParams } from '../models/index.js'
import { adjustmentPercentageOption, generateSourceDropdown } from '../options/index.js'
import { applyToMatches, standardAction } from './standardAction.js'

// Pulse Audio True Maximum (+11 dB)
const MAX_VOLUME = 153
const MIN_VOLUME = 0

const adjustedVolume = (adjustmentPercentagePoints: number) => (startingVolume: number) => {
	const currentPercentage = volumeToPercent(startingVolume)
	const percentageRatio = adjustmentPercentagePoints
	const adjustedPercentage = Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, currentPercentage + percentageRatio))
	const adjustedVolume = percentToVolume(adjustedPercentage)
	return adjustedVolume
}

const adjustVolumeSources = (client: PulseAudio, sources: PulseAudioSource[]): CompanionActionDefinition =>
	standardAction<SourceParams & VolumeAdjustParams>({
		name: 'Adjust Volume for Sources',
		options: [adjustmentPercentageOption, generateSourceDropdown(sources)],
		onEvent: async ({ adjustmentPercentage, sourceIDs }) => {
			const resolvedAdjustment = Number(adjustmentPercentage)
			return applyToMatches(
				sources,
				({ name }) => name,
				sourceIDs,
				async ({ volume, name }: PulseAudioSource) => {
					const newVolume = volume.current.map(adjustedVolume(resolvedAdjustment))
					return client.setSourceVolume(newVolume, name)
				},
			)
		},
	})

export default adjustVolumeSources
