import { combineRgb, CompanionPresetDefinition } from '@companion-module/base'

import { ACTION_ID_TOGGLE_MUTE_SOURCES } from '../actions/index.js'
import { FEEDBACK_ID_SOURCES_MUTED } from '../feedbacks/index.js'

const sourceMutePreset: CompanionPresetDefinition = {
	type: 'simple',
	name: 'Source Mute',
	style: {
		text: 'Input Mute',
		size: '18',
		color: combineRgb(255, 255, 255),
		bgcolor: combineRgb(0, 0, 0),
	},
	steps: [
		{
			down: [
				{
					actionId: ACTION_ID_TOGGLE_MUTE_SOURCES,
					options: {},
				},
			],
			up: [],
		},
	],
	feedbacks: [
		{
			feedbackId: FEEDBACK_ID_SOURCES_MUTED,
			options: {},
		},
	],
}

export default sourceMutePreset
