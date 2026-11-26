import type { CompanionInputFieldMultiDropdown, DropdownChoice } from '@companion-module/base'
import type { PulseAudioSinkInput } from '../models/index.js'

export const generateSinkInputChoices = (sinkInputs: PulseAudioSinkInput[]): DropdownChoice[] =>
	sinkInputs.map(({ properties: { media, application } }) => ({
		id: application.name,
		label: `${media.name} (${application.name})`,
	}))

export const generateSinkInputDropdown = (
	sinkInputs: PulseAudioSinkInput[],
	id = 'sinkInputApplicationNames',
	label = 'Sink Inputs',
	minimumSelection = 1,
): CompanionInputFieldMultiDropdown => ({
	id,
	type: 'multidropdown' as const,
	label,
	default: [],
	minSelection: minimumSelection,
	choices: generateSinkInputChoices(sinkInputs),
})
