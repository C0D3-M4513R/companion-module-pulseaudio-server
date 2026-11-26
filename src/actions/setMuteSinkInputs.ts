import type { PulseAudio } from 'pulseaudio-js'

import type { CompanionActionDefinition } from '@companion-module/base'

import type { PulseAudioSinkInput, SinkInputParams, MuteParams } from '../models/index.js'
import { generateSinkInputDropdown, muteStateOption } from '../options/index.js'

import { applyToMatches, standardAction } from './standardAction.js'

const setMuteSinkInputs = (client: PulseAudio, sinkInputs: PulseAudioSinkInput[]): CompanionActionDefinition =>
	standardAction<SinkInputParams & MuteParams>({
		name: 'Set Mute State for Sink Input',
		options: [muteStateOption, generateSinkInputDropdown(sinkInputs)],
		onEvent: async ({ sinkInputApplicationNames, muteState }) =>
			applyToMatches(
				sinkInputs,
				({ properties: { application } }) => application.name,
				sinkInputApplicationNames,
				async ({ index }) => client.setSinkInputMute(index, muteState),
			),
	})

export default setMuteSinkInputs
