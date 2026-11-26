import type { CompanionPresetDefinitions } from '@companion-module/base'
import sourceMute from './sourceMute.js'
import sinkMute from './sinkMute.js'
import sinkInputMute from './sinkInputMute.js'
import sinkInputVolumeAdjust from './sinkInputVolumeAdjust.js'

const presets: CompanionPresetDefinitions = {
	sourceMute,
	sinkMute,
	sinkInputMute,
	sinkInputVolumeAdjust,
}

export default presets
