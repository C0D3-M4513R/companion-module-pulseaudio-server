import {
    combineRgb,
    CompanionFeedbackDefinition,
} from '@companion-module/base';

import { generateSourceDropdown } from '../options/index.js';
import type { PulseAudioSource, SourceParams } from '../models/index.js';
import standardFeedback from './standardFeedback.js';

const sourcesMuted = (
    sources: PulseAudioSource[],
): CompanionFeedbackDefinition => standardFeedback<SourceParams>({
    name: 'Sources Muted',
    defaultStyle: {
        bgcolor: combineRgb(255, 0, 0),
        color: combineRgb(255, 255, 255),
        text: 'Input Muted',
    },
    options: [
        generateSourceDropdown(sources),
    ],
    onEvent: ({ sourceIDs }) => sources
        .filter(({ name }) => sourceIDs.includes(name))
        .every(({ mute }) => mute),
});

export default sourcesMuted;
