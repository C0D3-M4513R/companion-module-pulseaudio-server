import { percentToVolume, PulseAudio } from 'pulseaudio.js';
import type { CompanionActionDefinition } from '@companion-module/base';

import type { PulseAudioSource, SourceParams, VolumeParams } from '../models';
import { generateSourceDropdown, volumePercentageOption } from '../options';
import { applyToMatches, standardAction } from './standardAction';

const setVolumeSources = (
    client: PulseAudio,
    sources: PulseAudioSource[],
): CompanionActionDefinition => standardAction<SourceParams & VolumeParams>({
    name: 'Set Volume for Sources',
    options: [
        volumePercentageOption,
        generateSourceDropdown(sources),
    ],
    onEvent: async ({ sourceIDs, volumePercentage }, context) => {
        const resolvedVolume = Number(await context.parseVariablesInString(String(volumePercentage)));
        return applyToMatches(
            sources,
            ({ name }) => name,
            sourceIDs,
            ({ volume, name }: PulseAudioSource) => {
                const newVolume = volume.current.map(() => percentToVolume(resolvedVolume));
                return client.setSourceVolume(newVolume, name);
            },
        );
    },
});

export default setVolumeSources;