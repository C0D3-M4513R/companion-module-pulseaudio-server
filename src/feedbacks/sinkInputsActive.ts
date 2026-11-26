import type { CompanionFeedbackDefinition } from '@companion-module/base'

import standardFeedback from './standardFeedback.js'
import type { PulseAudioSinkInput, SinkInputParams, ActiveStateParams } from '../models/index.js'
import { generateSinkInputDropdown, activeStateOption } from '../options/index.js'

const sinkInputsActive = (sinkInputs: PulseAudioSinkInput[]): CompanionFeedbackDefinition =>
	standardFeedback<SinkInputParams & ActiveStateParams>({
		name: 'Sink Inputs Active',
		defaultStyle: {},
		options: [generateSinkInputDropdown(sinkInputs), activeStateOption],
		onEvent: ({ sinkInputApplicationNames, activeState }) => {
			const matches = sinkInputs.filter(({ properties: { application } }) =>
				sinkInputApplicationNames.includes(application.name),
			).length
			return activeState ? matches > 0 : matches <= 0
		},
	})

export default sinkInputsActive
