import { CompanionInputFieldMultiDropdown } from '@companion-module/base'
import type { DropdownChoice } from '@companion-module/base'
import type { PulseAudioSink } from '../models/index.js'

export const generateSinkChoices = (availableSources: PulseAudioSink[]): DropdownChoice[] =>
	availableSources.map(({ name, description }) => ({
		id: name,
		label: description,
	}))

export const generateSinkDropdown = (
	availableSources: PulseAudioSink[],
	id = 'sinkIDs',
	label = 'Sinks',
	minimumSelection = 1,
): CompanionInputFieldMultiDropdown => ({
	id,
	type: 'multidropdown',
	label,
	default: [],
	minSelection: minimumSelection,
	choices: generateSinkChoices(availableSources),
})
