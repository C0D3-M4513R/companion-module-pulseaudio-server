import {
    combineRgb,
    CompanionFeedbackDefinition,
} from '@companion-module/base';

import { SinkParams, type PulseAudioSink } from '../models/index.js';
import { generateSinkDropdown } from '../options/index.js';
import standardFeedback from './standardFeedback.js';

const sinksMuted = (
    sinks: PulseAudioSink[],
): CompanionFeedbackDefinition => standardFeedback<SinkParams>({
    name: 'Sinks Muted',
    defaultStyle: {
        bgcolor: combineRgb(255, 0, 0),
        color: combineRgb(255, 255, 255),
        text: 'Output Muted',
    },
    options: [generateSinkDropdown(sinks)],
    onEvent: ({ sinkIDs }) => sinks
        .filter(({ name }) => sinkIDs.includes(name))
        .every(({ mute }) => mute),
});

export default sinksMuted;
