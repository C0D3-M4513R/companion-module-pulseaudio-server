import { percentToVolume, PulseAudio } from 'pulseaudio.js';
import type { CompanionActionDefinition } from '@companion-module/base';

import type { PulseAudioSink, SinkParams, VolumeParams } from '../models';
import { generateSinkDropdown, volumePercentageOption } from '../options';
import { applyToMatches, standardAction } from './standardAction';

const setVolumeSinks = (
    client: PulseAudio,
    sinks: PulseAudioSink[],
): CompanionActionDefinition => standardAction<SinkParams & VolumeParams>({
    name: 'Set Volume for Sinks',
    options: [
        volumePercentageOption,
        generateSinkDropdown(sinks),
    ],
    onEvent: async ({ sinkIDs, volumePercentage }) => applyToMatches(
        sinks,
        ({ name }) => name,
        sinkIDs,
        ({ volume, name }: PulseAudioSink) => {
            const newVolume = volume.current.map(() => percentToVolume(volumePercentage));
            return client.setSinkVolume(newVolume, name);
        },
    ),
});

export default setVolumeSinks;