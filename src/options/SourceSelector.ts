import type { CompanionInputFieldMultiDropdown, DropdownChoice } from '@companion-module/base'
import type { PulseAudioSource } from '../models/index.js'

export const generateSourceChoices = (availableSources: PulseAudioSource[]): DropdownChoice[] =>
	availableSources.map(({ name, description }) => ({
		id: name,
		label: description,
	}))

export const generateSourceDropdown = (
	availableSources: PulseAudioSource[],
	id = 'sourceIDs',
	label = 'Sources',
	minimumSelection = 1,
): CompanionInputFieldMultiDropdown => ({
	id,
	type: 'multidropdown' as const,
	label,
	default: [],
	minSelection: minimumSelection,
	choices: generateSourceChoices(availableSources),
})
