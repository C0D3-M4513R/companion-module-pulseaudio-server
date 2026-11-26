import type { PulseAudio } from 'pulseaudio.js';

import type { CompanionActionDefinition } from '@companion-module/base';

import type { PulseAudioSource, SourceParams, MuteParams } from '../models/index.js';
import { generateSourceDropdown, muteStateOption } from '../options/index.js';

import { applyToMatches, standardAction } from './standardAction.js';

const setMuteSources = (
    client: PulseAudio,
    sources: PulseAudioSource[],
): CompanionActionDefinition => standardAction<SourceParams & MuteParams>({
    name: 'Set Mute State for Sources',
    options: [
        muteStateOption,
        generateSourceDropdown(sources),
    ],
    onEvent: async ({ sourceIDs, muteState }) => applyToMatches(
        sources,
        ({ name }) => name,
        sourceIDs,
        ({ name }) => client.setSourceMute(muteState, name),
    ),
});

export default setMuteSources;
