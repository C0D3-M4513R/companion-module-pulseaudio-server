import type { PulseAudio } from 'pulseaudio.js'

import type { CompanionActionDefinition } from '@companion-module/base'

import type { PulseAudioSink, SinkParams, MuteParams } from '../models/index.js'
import { generateSinkDropdown, muteStateOption } from '../options/index.js'
import { standardAction, applyToMatches } from './standardAction.js'

const setMuteSinks = (client: PulseAudio, sinks: PulseAudioSink[]): CompanionActionDefinition =>
	standardAction<SinkParams & MuteParams>({
		name: 'Set Mute State for Sinks',
		options: [muteStateOption, generateSinkDropdown(sinks)],
		onEvent: async ({ sinkIDs, muteState }) =>
			applyToMatches(
				sinks,
				({ name }) => name,
				sinkIDs,
				async ({ name }) => client.setSinkMute(muteState, name),
			),
	})

export default setMuteSinks
