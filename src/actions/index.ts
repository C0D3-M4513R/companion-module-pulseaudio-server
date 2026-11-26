import type { PulseAudio } from 'pulseaudio-js'
import type { CompanionActionDefinitions } from '@companion-module/base'

import setMuteSources from './setMuteSources.js'
import setMuteSinks from './setMuteSinks.js'
import setMuteSinkInputs from './setMuteSinkInputs.js'
import toggleMuteSinkInputs from './toggleMuteSinkInputs.js'
import toggleMuteSources from './toggleMuteSources.js'
import toggleMuteSinks from './toggleMuteSinks.js'
import volumeAdjustSinkInputs from './volumeAdjustSinkInputs.js'
import setVolumeSinks from './setVolumeSinks.js'
import setVolumeSources from './setVolumeSources.js'
import adjustVolumeSources from './adjustVolumeSources.js'

import type { PulseAudioSink, PulseAudioSource, PulseAudioSinkInput } from '../models/index.js'

export const ACTION_ID_SET_MUTE_SOURCES = 'setMuteSources'
export const ACTION_ID_TOGGLE_MUTE_SOURCES = 'toggleMuteSources'
export const ACTION_ID_SET_MUTE_SINKS = 'setMuteSinks'
export const ACTION_ID_TOGGLE_MUTE_SINKS = 'toggleMuteSinks'
export const ACTION_ID_SET_MUTE_SINK_INPUTS = 'setMuteSinkInputs'
export const ACTION_ID_TOGGLE_MUTE_SINK_INPUTS = 'toggleMuteSinkInputs'
export const ACTION_ID_VOLUME_ADJUST_SINK_INPUTS = 'volumeAdjustSinkInputs'
export const ACTION_ID_SET_VOLUME_SINKS = 'setVolumeSinks'
export const ACTION_ID_SET_VOLUME_SOURCES = 'setVolumeSources'
export const ACTION_ID_ADJUST_VOLUME_SOURCES = 'adjustVolumeSources'

const generateActions = (
	client: PulseAudio,
	sources: PulseAudioSource[],
	sinks: PulseAudioSink[],
	sinkInputs: PulseAudioSinkInput[],
): CompanionActionDefinitions => ({
	[ACTION_ID_SET_MUTE_SOURCES]: setMuteSources(client, sources),
	[ACTION_ID_TOGGLE_MUTE_SOURCES]: toggleMuteSources(client, sources),
	[ACTION_ID_SET_MUTE_SINKS]: setMuteSinks(client, sinks),
	[ACTION_ID_TOGGLE_MUTE_SINKS]: toggleMuteSinks(client, sinks),
	[ACTION_ID_SET_MUTE_SINK_INPUTS]: setMuteSinkInputs(client, sinkInputs),
	[ACTION_ID_TOGGLE_MUTE_SINK_INPUTS]: toggleMuteSinkInputs(client, sinkInputs),
	[ACTION_ID_VOLUME_ADJUST_SINK_INPUTS]: volumeAdjustSinkInputs(client, sinkInputs),
	[ACTION_ID_SET_VOLUME_SINKS]: setVolumeSinks(client, sinks),
	[ACTION_ID_SET_VOLUME_SOURCES]: setVolumeSources(client, sources),
	[ACTION_ID_ADJUST_VOLUME_SOURCES]: adjustVolumeSources(client, sources),
})

export default generateActions
