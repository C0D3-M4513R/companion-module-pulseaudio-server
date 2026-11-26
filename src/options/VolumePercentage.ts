import { CompanionInputFieldNumber } from '@companion-module/base'

const volumePercentageOption: CompanionInputFieldNumber = {
	id: 'volumePercentage',
	type: 'number',
	label: 'Volume %',
	tooltip: 'Absolute volume percentage to set (0-153).',
	default: 100,
	min: 0,
	max: 153,
}

export default volumePercentageOption
