"use client";

import { touhouMusicTracks, type TouhouMusicTrack } from "@/constants/design-tokens";
import { clamp } from "@/lib/utils";
import type { OmamoriRouteId, OmamoriSettings } from "@/types/omikuji";

type MaybeAudioContext = AudioContext | null;
type AmbientNode = OscillatorNode | AudioBufferSourceNode | BiquadFilterNode | GainNode | StereoPannerNode | DelayNode;
type MusicPlaybackMode = "random" | "sequential";
type RitualSoundSceneId = OmamoriRouteId;

interface ToneLayer {
  kind: OscillatorType;
  frequency: number;
  gain: number;
  duration: number;
  delay?: number;
  detune?: number;
  pan?: number;
  attack?: number;
  filterType?: BiquadFilterType;
  filterFrequency?: number;
  filterQ?: number;
}

interface NoiseLayer {
  duration: number;
  gain: number;
  filterType: BiquadFilterType;
  filterFrequency: number;
  delay?: number;
  pan?: number;
  filterQ?: number;
  decay?: number;
  repeats?: number[];
}

interface RitualSoundStage {
  tones?: ToneLayer[];
  noises?: NoiseLayer[];
}

interface RitualSoundProfile {
  bell: RitualSoundStage;
  shake: RitualSoundStage;
  paper: RitualSoundStage;
  preview: RitualSoundStage;
}

interface MusicManifest {
  playbackMode?: MusicPlaybackMode;
  tracks?: TouhouMusicTrack[];
}

const MUSIC_MANIFEST_URL = "/audio/music/tracks.json";
const pentatonicScale = [0, 2, 5, 7, 9, 12, 14, 17];
const melodyPattern = [0, 2, 4, 5, 4, 2, 1, 0, 3, 5, 7, 5, 4, 2, 0, 1];
const synthRoots = [261.63, 293.66, 329.63, 349.23, 392, 440];
const DEFAULT_RITUAL_SOUND_SCENE_ID: RitualSoundSceneId = "hakurei";

const ritualSoundProfiles = {
  hakurei: {
    bell: {
      tones: [
        { kind: "sine", frequency: 660, gain: 0.58, duration: 1.2 },
        { kind: "triangle", frequency: 988, gain: 0.22, duration: 0.9, detune: 4, delay: 0.02 },
        { kind: "sine", frequency: 1320, gain: 0.1, duration: 0.6, delay: 0.04 },
      ],
    },
    shake: {
      noises: [
        { duration: 0.22, gain: 0.18, filterType: "bandpass", filterFrequency: 900, repeats: [0, 0.08, 0.16] },
      ],
    },
    paper: {
      noises: [{ duration: 0.35, gain: 0.26, filterType: "highpass", filterFrequency: 1500, decay: 1400 }],
      tones: [{ kind: "sine", frequency: 880, gain: 0.08, duration: 0.5, delay: 0.08, pan: 0.12 }],
    },
    preview: {
      tones: [
        { kind: "sine", frequency: 660, gain: 0.36, duration: 0.7 },
        { kind: "triangle", frequency: 990, gain: 0.12, duration: 0.56, delay: 0.03 },
      ],
    },
  },
  scarlet: {
    bell: {
      tones: [
        { kind: "triangle", frequency: 523.25, gain: 0.34, duration: 0.72, pan: -0.18 },
        { kind: "sine", frequency: 783.99, gain: 0.2, duration: 0.9, delay: 0.06, pan: 0.2 },
        { kind: "sine", frequency: 1174.66, gain: 0.09, duration: 0.62, delay: 0.11 },
      ],
      noises: [{ duration: 0.18, gain: 0.035, filterType: "highpass", filterFrequency: 2600, delay: 0.04, pan: 0.18 }],
    },
    shake: {
      noises: [
        { duration: 0.12, gain: 0.12, filterType: "bandpass", filterFrequency: 1700, filterQ: 8, repeats: [0, 0.07, 0.15, 0.24] },
      ],
      tones: [
        { kind: "sine", frequency: 1568, gain: 0.045, duration: 0.22, delay: 0.03, pan: -0.2 },
        { kind: "sine", frequency: 1760, gain: 0.035, duration: 0.18, delay: 0.18, pan: 0.24 },
      ],
    },
    paper: {
      noises: [
        { duration: 0.28, gain: 0.13, filterType: "highpass", filterFrequency: 1850, decay: 1000 },
        { duration: 0.45, gain: 0.045, filterType: "lowpass", filterFrequency: 850, decay: 3800, delay: 0.05, pan: -0.12 },
      ],
      tones: [{ kind: "triangle", frequency: 698.46, gain: 0.07, duration: 0.46, delay: 0.1 }],
    },
    preview: {
      tones: [
        { kind: "triangle", frequency: 523.25, gain: 0.24, duration: 0.5, pan: -0.16 },
        { kind: "sine", frequency: 1174.66, gain: 0.08, duration: 0.45, delay: 0.08, pan: 0.18 },
      ],
      noises: [{ duration: 0.16, gain: 0.04, filterType: "highpass", filterFrequency: 2400, delay: 0.03 }],
    },
  },
  eientei: {
    bell: {
      tones: [
        { kind: "sine", frequency: 704, gain: 0.3, duration: 1.05, pan: -0.12 },
        { kind: "triangle", frequency: 1056, gain: 0.16, duration: 0.92, delay: 0.08, pan: 0.14 },
        { kind: "sine", frequency: 528, gain: 0.09, duration: 1.2, delay: 0.02 },
      ],
    },
    shake: {
      noises: [
        { duration: 0.18, gain: 0.13, filterType: "bandpass", filterFrequency: 620, filterQ: 5, repeats: [0, 0.1, 0.22] },
        { duration: 0.16, gain: 0.055, filterType: "highpass", filterFrequency: 2100, repeats: [0.05, 0.17], pan: 0.24 },
      ],
    },
    paper: {
      noises: [
        { duration: 0.42, gain: 0.16, filterType: "highpass", filterFrequency: 1150, decay: 1800 },
        { duration: 0.58, gain: 0.035, filterType: "bandpass", filterFrequency: 480, filterQ: 4, delay: 0.04, pan: -0.18 },
      ],
      tones: [{ kind: "sine", frequency: 880, gain: 0.065, duration: 0.76, delay: 0.08, detune: -5 }],
    },
    preview: {
      tones: [
        { kind: "sine", frequency: 704, gain: 0.22, duration: 0.62 },
        { kind: "triangle", frequency: 1056, gain: 0.08, duration: 0.5, delay: 0.08 },
      ],
    },
  },
  "moriya-shrine": {
    bell: {
      tones: [
        { kind: "sine", frequency: 739.99, gain: 0.34, duration: 0.85, pan: -0.2 },
        { kind: "triangle", frequency: 1108.73, gain: 0.16, duration: 0.78, delay: 0.05, pan: 0.22 },
      ],
      noises: [{ duration: 0.5, gain: 0.045, filterType: "highpass", filterFrequency: 1400, decay: 5200, pan: -0.24 }],
    },
    shake: {
      noises: [
        { duration: 0.26, gain: 0.14, filterType: "bandpass", filterFrequency: 760, repeats: [0, 0.11, 0.24] },
        { duration: 0.44, gain: 0.05, filterType: "highpass", filterFrequency: 1200, decay: 4500, pan: 0.28 },
      ],
    },
    paper: {
      noises: [{ duration: 0.52, gain: 0.18, filterType: "highpass", filterFrequency: 1350, decay: 2100 }],
      tones: [{ kind: "sine", frequency: 987.77, gain: 0.08, duration: 0.58, delay: 0.12 }],
    },
    preview: {
      tones: [{ kind: "sine", frequency: 739.99, gain: 0.25, duration: 0.52 }],
      noises: [{ duration: 0.32, gain: 0.04, filterType: "highpass", filterFrequency: 1400, decay: 3600 }],
    },
  },
  hakugyokurou: {
    bell: {
      tones: [
        { kind: "sine", frequency: 587.33, gain: 0.24, duration: 0.92, pan: -0.08 },
        { kind: "sine", frequency: 880, gain: 0.14, duration: 0.8, delay: 0.07, pan: 0.18 },
        { kind: "triangle", frequency: 1318.51, gain: 0.06, duration: 0.5, delay: 0.18 },
      ],
    },
    shake: {
      noises: [
        { duration: 0.28, gain: 0.11, filterType: "bandpass", filterFrequency: 980, repeats: [0, 0.12] },
        { duration: 0.46, gain: 0.04, filterType: "highpass", filterFrequency: 1600, decay: 4400, pan: -0.18 },
      ],
    },
    paper: {
      noises: [{ duration: 0.48, gain: 0.12, filterType: "highpass", filterFrequency: 1650, decay: 2300 }],
      tones: [
        { kind: "sine", frequency: 1567.98, gain: 0.075, duration: 0.32, delay: 0.06, pan: 0.2 },
        { kind: "triangle", frequency: 659.25, gain: 0.05, duration: 0.7, delay: 0.14 },
      ],
    },
    preview: {
      tones: [
        { kind: "sine", frequency: 587.33, gain: 0.18, duration: 0.56 },
        { kind: "sine", frequency: 1318.51, gain: 0.05, duration: 0.36, delay: 0.12 },
      ],
    },
  },
  "forest-of-magic": {
    bell: {
      tones: [
        { kind: "triangle", frequency: 622.25, gain: 0.25, duration: 0.66, pan: -0.16 },
        { kind: "sine", frequency: 932.33, gain: 0.14, duration: 0.58, delay: 0.08, pan: 0.16 },
        { kind: "sine", frequency: 1396.91, gain: 0.06, duration: 0.38, delay: 0.19 },
      ],
    },
    shake: {
      noises: [
        { duration: 0.24, gain: 0.11, filterType: "bandpass", filterFrequency: 720, repeats: [0, 0.1, 0.22] },
        { duration: 0.3, gain: 0.045, filterType: "highpass", filterFrequency: 2300, repeats: [0.05, 0.18], pan: 0.24 },
      ],
    },
    paper: {
      noises: [{ duration: 0.4, gain: 0.15, filterType: "highpass", filterFrequency: 1450, decay: 1800 }],
      tones: [
        { kind: "sine", frequency: 1046.5, gain: 0.06, duration: 0.36, delay: 0.08, pan: -0.2 },
        { kind: "sine", frequency: 1567.98, gain: 0.04, duration: 0.32, delay: 0.2, pan: 0.22 },
      ],
    },
    preview: {
      tones: [
        { kind: "triangle", frequency: 622.25, gain: 0.18, duration: 0.44 },
        { kind: "sine", frequency: 1396.91, gain: 0.045, duration: 0.3, delay: 0.12 },
      ],
    },
  },
  "myouren-temple": {
    bell: {
      tones: [
        { kind: "triangle", frequency: 220, gain: 0.22, duration: 0.5, pan: -0.12 },
        { kind: "sine", frequency: 440, gain: 0.18, duration: 0.85, delay: 0.05 },
        { kind: "sine", frequency: 660, gain: 0.08, duration: 0.7, delay: 0.12, pan: 0.16 },
      ],
    },
    shake: {
      noises: [{ duration: 0.2, gain: 0.16, filterType: "bandpass", filterFrequency: 520, filterQ: 6, repeats: [0, 0.14, 0.29] }],
      tones: [{ kind: "triangle", frequency: 196, gain: 0.07, duration: 0.28, delay: 0.02 }],
    },
    paper: {
      noises: [{ duration: 0.5, gain: 0.14, filterType: "highpass", filterFrequency: 1200, decay: 2600 }],
      tones: [{ kind: "sine", frequency: 523.25, gain: 0.055, duration: 0.7, delay: 0.08 }],
    },
    preview: {
      tones: [
        { kind: "triangle", frequency: 220, gain: 0.16, duration: 0.34 },
        { kind: "sine", frequency: 660, gain: 0.06, duration: 0.54, delay: 0.06 },
      ],
    },
  },
  "palace-of-earth-spirits": {
    bell: {
      tones: [
        { kind: "triangle", frequency: 196, gain: 0.2, duration: 0.72, pan: -0.1 },
        { kind: "sine", frequency: 293.66, gain: 0.14, duration: 0.95, delay: 0.05 },
        { kind: "sine", frequency: 587.33, gain: 0.045, duration: 0.46, delay: 0.18, pan: 0.18 },
      ],
      noises: [{ duration: 0.28, gain: 0.035, filterType: "lowpass", filterFrequency: 520, decay: 2600 }],
    },
    shake: {
      noises: [
        { duration: 0.2, gain: 0.12, filterType: "bandpass", filterFrequency: 470, repeats: [0, 0.12, 0.25] },
        { duration: 0.22, gain: 0.045, filterType: "highpass", filterFrequency: 1700, repeats: [0.08, 0.21], pan: 0.22 },
      ],
    },
    paper: {
      noises: [{ duration: 0.42, gain: 0.13, filterType: "highpass", filterFrequency: 1050, decay: 2200 }],
      tones: [{ kind: "sine", frequency: 392, gain: 0.07, duration: 0.82, delay: 0.08, detune: -8 }],
    },
    preview: {
      tones: [
        { kind: "triangle", frequency: 196, gain: 0.15, duration: 0.5 },
        { kind: "sine", frequency: 587.33, gain: 0.035, duration: 0.32, delay: 0.14 },
      ],
      noises: [{ duration: 0.2, gain: 0.026, filterType: "lowpass", filterFrequency: 520, delay: 0.03 }],
    },
  },
  "sanzu-river": {
    bell: {
      tones: [
        { kind: "sine", frequency: 440, gain: 0.22, duration: 0.82, pan: -0.16 },
        { kind: "triangle", frequency: 659.25, gain: 0.1, duration: 0.64, delay: 0.08, pan: 0.16 },
      ],
      noises: [{ duration: 0.5, gain: 0.045, filterType: "lowpass", filterFrequency: 700, decay: 5000 }],
    },
    shake: {
      noises: [
        { duration: 0.32, gain: 0.1, filterType: "bandpass", filterFrequency: 620, repeats: [0, 0.16] },
        { duration: 0.45, gain: 0.04, filterType: "lowpass", filterFrequency: 520, decay: 5200, pan: -0.22 },
      ],
      tones: [{ kind: "sine", frequency: 880, gain: 0.04, duration: 0.22, delay: 0.13 }],
    },
    paper: {
      noises: [
        { duration: 0.5, gain: 0.12, filterType: "highpass", filterFrequency: 1100, decay: 2400 },
        { duration: 0.62, gain: 0.04, filterType: "lowpass", filterFrequency: 620, decay: 6200, delay: 0.05 },
      ],
    },
    preview: {
      tones: [{ kind: "sine", frequency: 440, gain: 0.15, duration: 0.56 }],
      noises: [{ duration: 0.42, gain: 0.032, filterType: "lowpass", filterFrequency: 700, decay: 4400 }],
    },
  },
  "misty-lake": {
    bell: {
      tones: [
        { kind: "sine", frequency: 880, gain: 0.22, duration: 0.72, pan: -0.18 },
        { kind: "sine", frequency: 1318.51, gain: 0.1, duration: 0.56, delay: 0.1, pan: 0.2 },
      ],
      noises: [{ duration: 0.34, gain: 0.04, filterType: "highpass", filterFrequency: 2600, decay: 2800 }],
    },
    shake: {
      noises: [
        { duration: 0.18, gain: 0.1, filterType: "bandpass", filterFrequency: 1300, filterQ: 7, repeats: [0, 0.1, 0.2] },
        { duration: 0.38, gain: 0.04, filterType: "highpass", filterFrequency: 2000, decay: 3600, pan: 0.22 },
      ],
    },
    paper: {
      noises: [{ duration: 0.44, gain: 0.13, filterType: "highpass", filterFrequency: 1500, decay: 2200 }],
      tones: [{ kind: "sine", frequency: 1760, gain: 0.045, duration: 0.42, delay: 0.08 }],
    },
    preview: {
      tones: [
        { kind: "sine", frequency: 880, gain: 0.16, duration: 0.48 },
        { kind: "sine", frequency: 1318.51, gain: 0.055, duration: 0.34, delay: 0.12 },
      ],
      noises: [{ duration: 0.2, gain: 0.028, filterType: "highpass", filterFrequency: 2600 }],
    },
  },
  "human-village": {
    bell: {
      tones: [
        { kind: "triangle", frequency: 392, gain: 0.24, duration: 0.58, pan: -0.12 },
        { kind: "sine", frequency: 587.33, gain: 0.13, duration: 0.7, delay: 0.07, pan: 0.15 },
      ],
      noises: [{ duration: 0.18, gain: 0.04, filterType: "bandpass", filterFrequency: 900, delay: 0.02 }],
    },
    shake: {
      noises: [
        { duration: 0.18, gain: 0.16, filterType: "bandpass", filterFrequency: 560, repeats: [0, 0.09, 0.2] },
        { duration: 0.24, gain: 0.045, filterType: "highpass", filterFrequency: 1450, repeats: [0.07, 0.18], pan: -0.2 },
      ],
    },
    paper: {
      noises: [{ duration: 0.36, gain: 0.17, filterType: "highpass", filterFrequency: 1250, decay: 1700 }],
      tones: [{ kind: "triangle", frequency: 493.88, gain: 0.05, duration: 0.5, delay: 0.08 }],
    },
    preview: {
      tones: [{ kind: "triangle", frequency: 392, gain: 0.18, duration: 0.42 }],
      noises: [{ duration: 0.16, gain: 0.045, filterType: "bandpass", filterFrequency: 700, delay: 0.06 }],
    },
  },
  "sunflower-field": {
    bell: {
      tones: [
        { kind: "sine", frequency: 523.25, gain: 0.25, duration: 0.62, pan: -0.12 },
        { kind: "triangle", frequency: 783.99, gain: 0.15, duration: 0.58, delay: 0.08, pan: 0.16 },
        { kind: "sine", frequency: 1046.5, gain: 0.06, duration: 0.42, delay: 0.16 },
      ],
    },
    shake: {
      noises: [
        { duration: 0.22, gain: 0.12, filterType: "bandpass", filterFrequency: 680, repeats: [0, 0.11, 0.24] },
        { duration: 0.42, gain: 0.04, filterType: "highpass", filterFrequency: 1550, decay: 4300, pan: 0.22 },
      ],
    },
    paper: {
      noises: [{ duration: 0.42, gain: 0.15, filterType: "highpass", filterFrequency: 1350, decay: 2100 }],
      tones: [{ kind: "sine", frequency: 1046.5, gain: 0.06, duration: 0.48, delay: 0.1 }],
    },
    preview: {
      tones: [
        { kind: "sine", frequency: 523.25, gain: 0.18, duration: 0.42 },
        { kind: "sine", frequency: 1046.5, gain: 0.045, duration: 0.32, delay: 0.12 },
      ],
    },
  },
  "divine-spirit-mausoleum": {
    bell: {
      tones: [
        { kind: "triangle", frequency: 550, gain: 0.28, duration: 0.9, pan: -0.1 },
        { kind: "sine", frequency: 825, gain: 0.16, duration: 0.78, delay: 0.07 },
        { kind: "sine", frequency: 1100, gain: 0.08, duration: 0.58, delay: 0.15, pan: 0.18 },
      ],
    },
    shake: {
      noises: [
        { duration: 0.2, gain: 0.13, filterType: "bandpass", filterFrequency: 760, repeats: [0, 0.11, 0.24] },
        { duration: 0.28, gain: 0.04, filterType: "lowpass", filterFrequency: 520, delay: 0.08, decay: 3200 },
      ],
    },
    paper: {
      noises: [{ duration: 0.43, gain: 0.15, filterType: "highpass", filterFrequency: 1400, decay: 2100 }],
      tones: [{ kind: "sine", frequency: 1234, gain: 0.06, duration: 0.56, delay: 0.08 }],
    },
    preview: {
      tones: [
        { kind: "triangle", frequency: 550, gain: 0.2, duration: 0.52 },
        { kind: "sine", frequency: 1100, gain: 0.055, duration: 0.36, delay: 0.12 },
      ],
    },
  },
  "nameless-hill": {
    bell: {
      tones: [
        { kind: "sine", frequency: 739.99, gain: 0.14, duration: 0.92, pan: -0.12 },
        { kind: "triangle", frequency: 1108.73, gain: 0.055, duration: 0.68, delay: 0.12, pan: 0.16 },
      ],
      noises: [{ duration: 0.58, gain: 0.022, filterType: "lowpass", filterFrequency: 420, decay: 6800 }],
    },
    shake: {
      noises: [
        { duration: 0.24, gain: 0.08, filterType: "bandpass", filterFrequency: 620, repeats: [0, 0.18] },
        { duration: 0.48, gain: 0.028, filterType: "lowpass", filterFrequency: 520, decay: 6200, pan: -0.2 },
      ],
    },
    paper: {
      noises: [{ duration: 0.54, gain: 0.1, filterType: "highpass", filterFrequency: 980, decay: 2600 }],
      tones: [{ kind: "sine", frequency: 880, gain: 0.035, duration: 0.78, delay: 0.12, detune: -4 }],
    },
    preview: {
      tones: [{ kind: "sine", frequency: 739.99, gain: 0.1, duration: 0.58 }],
      noises: [{ duration: 0.4, gain: 0.018, filterType: "lowpass", filterFrequency: 420, decay: 5200 }],
    },
  },
} satisfies Record<RitualSoundSceneId, RitualSoundProfile>;

function pickRandomIndex(length: number): number {
  if (length <= 1) {
    return 0;
  }

  return Math.floor(Math.random() * length);
}

function getRitualSoundProfile(sceneId: string | undefined): RitualSoundProfile {
  return ritualSoundProfiles[(sceneId ?? DEFAULT_RITUAL_SOUND_SCENE_ID) as RitualSoundSceneId] ?? ritualSoundProfiles.hakurei;
}

class OmamoriAudioEngine {
  private context: MaybeAudioContext = null;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambienceNodes: AmbientNode[] = [];
  private musicElement: HTMLAudioElement | null = null;
  private currentTrackIndex = -1;
  private settings: OmamoriSettings | null = null;
  private melodyTimer: number | null = null;
  private melodyStep = 0;
  private synthRoot = 293.66;
  private availableTrackCache: TouhouMusicTrack[] | null = null;
  private musicPlaybackMode: MusicPlaybackMode = "random";

  private get AudioContextCtor(): typeof AudioContext | undefined {
    if (typeof window === "undefined") {
      return undefined;
    }

    return window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  }

  private ensureContext(): AudioContext | null {
    if (this.context) {
      return this.context;
    }

    const AudioCtor = this.AudioContextCtor;
    if (!AudioCtor) {
      return null;
    }

    this.context = new AudioCtor();
    this.masterGain = this.context.createGain();
    this.ambienceGain = this.context.createGain();
    this.sfxGain = this.context.createGain();

    this.masterGain.gain.value = 0.9;
    this.ambienceGain.gain.value = 0;
    this.sfxGain.gain.value = 0;

    this.ambienceGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);

    return this.context;
  }

  async unlock(): Promise<void> {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    if (this.settings) {
      this.applySettings(this.settings);
    }
  }

  async warmUp(): Promise<void> {
    if (!this.settings?.ambienceEnabled) {
      return;
    }

    try {
      await this.startAmbient({ allowSynthFallback: false });
    } catch {
      // Browser autoplay policies may block audio before a user gesture.
    }

    try {
      await this.unlock();
    } catch {
      // Browser autoplay policies may block audio before a user gesture.
    }
  }

  setSettings(settings: OmamoriSettings): void {
    this.settings = settings;
    if (!this.context) {
      return;
    }

    this.applySettings(settings);
  }

  private applySettings(settings: OmamoriSettings): void {
    if (!this.context || !this.ambienceGain || !this.sfxGain) {
      return;
    }

    const context = this.context;
    const ambienceVolume = settings.ambienceEnabled ? clamp(settings.ambienceVolume, 0, 1) : 0;

    this.ambienceGain.gain.setTargetAtTime(ambienceVolume * 0.18, context.currentTime, 0.08);
    this.sfxGain.gain.setTargetAtTime(settings.sfxEnabled ? clamp(settings.sfxVolume, 0, 1) * 0.36 : 0, context.currentTime, 0.04);

    if (this.musicElement) {
      this.musicElement.volume = ambienceVolume * 0.5;
    }

    if (settings.ambienceEnabled && context.state === "running") {
      void this.startAmbient();
    } else if (!settings.ambienceEnabled) {
      this.stopAmbient();
    }
  }

  private async startAmbient({ allowSynthFallback = true }: { allowSynthFallback?: boolean } = {}): Promise<void> {
    if (this.musicElement || this.ambienceNodes.length > 0 || this.melodyTimer !== null) {
      return;
    }

    const startedMusic = await this.startRandomMusicTrack();
    if (!startedMusic && allowSynthFallback) {
      this.startSynthTouhouLoop();
    }
  }

  private async startRandomMusicTrack(): Promise<boolean> {
    if (typeof Audio === "undefined" || !this.settings?.ambienceEnabled) {
      return false;
    }

    const availableTracks = await this.getAvailableTracks();
    if (availableTracks.length === 0) {
      return false;
    }

    const orderedTracks = this.getOrderedTracks(availableTracks);

    for (const track of orderedTracks) {
      const audio = new Audio(track.src);
      audio.autoplay = true;
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = clamp(this.settings.ambienceVolume, 0, 1) * 0.5;

      try {
        await audio.play();
        this.stopMusicElement();
        this.currentTrackIndex = availableTracks.findIndex((item) => item.src === track.src);
        this.musicElement = audio;
        return true;
      } catch (error) {
        audio.pause();
        if (error instanceof Error && error.name === "NotAllowedError") {
          return false;
        }
      }
    }

    return false;
  }

  private getOrderedTracks(availableTracks: TouhouMusicTrack[]): TouhouMusicTrack[] {
    if (this.musicPlaybackMode !== "random") {
      return availableTracks;
    }

    const startIndex = pickRandomIndex(availableTracks.length);
    return availableTracks.map((_, index) => availableTracks[(startIndex + index) % availableTracks.length]);
  }

  private async getAvailableTracks(): Promise<TouhouMusicTrack[]> {
    if (this.availableTrackCache) {
      return this.availableTrackCache;
    }

    if (typeof fetch === "undefined") {
      this.availableTrackCache = [];
      return this.availableTrackCache;
    }

    try {
      const response = await fetch(MUSIC_MANIFEST_URL, { cache: "force-cache" });
      const payload = response.ok ? ((await response.json()) as MusicManifest) : null;
      this.musicPlaybackMode = payload?.playbackMode === "sequential" ? "sequential" : "random";
      this.availableTrackCache = Array.isArray(payload?.tracks)
        ? payload.tracks.filter((track) => typeof track.title === "string" && typeof track.src === "string")
        : [];
    } catch {
      this.availableTrackCache = [];
    }

    return this.availableTrackCache;
  }

  private startSynthTouhouLoop(): void {
    const context = this.ensureContext();
    if (!context || !this.ambienceGain || this.ambienceNodes.length > 0 || this.melodyTimer !== null) {
      return;
    }

    const baseGain = context.createGain();
    const shimmerDelay = context.createDelay();
    const shimmerGain = context.createGain();
    const lowpass = context.createBiquadFilter();

    baseGain.gain.value = 0.74;
    shimmerDelay.delayTime.value = 0.24;
    shimmerGain.gain.value = 0.18;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3600;

    baseGain.connect(lowpass);
    lowpass.connect(this.ambienceGain);
    baseGain.connect(shimmerDelay);
    shimmerDelay.connect(shimmerGain);
    shimmerGain.connect(lowpass);

    this.ambienceNodes.push(baseGain, shimmerDelay, shimmerGain, lowpass);
    this.createDrone(146.83, 0.16, -0.35, baseGain);
    this.createDrone(220, 0.08, 0.32, baseGain);

    const presetIndex = pickRandomIndex(touhouMusicTracks.length || synthRoots.length);
    this.synthRoot = synthRoots[presetIndex % synthRoots.length];
    this.melodyStep = presetIndex * 3;
    this.scheduleMelodyNote();
    this.melodyTimer = window.setInterval(() => this.scheduleMelodyNote(), 430);
  }

  private createDrone(frequency: number, gainLevel: number, panValue: number, destination: GainNode): void {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const pan = context.createStereoPanner();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = gainLevel;
    pan.pan.value = panValue;

    oscillator.connect(gain);
    gain.connect(pan);
    pan.connect(destination);
    oscillator.start();

    this.ambienceNodes.push(oscillator, gain, pan);
  }

  private scheduleMelodyNote(): void {
    const context = this.ensureContext();
    if (!context || !this.ambienceGain || !this.settings?.ambienceEnabled) {
      return;
    }

    const now = context.currentTime;
    const noteIndex = melodyPattern[this.melodyStep % melodyPattern.length];
    const semitone = pentatonicScale[noteIndex % pentatonicScale.length];
    const frequency = this.synthRoot * Math.pow(2, semitone / 12);
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const pan = context.createStereoPanner();

    oscillator.type = this.melodyStep % 4 === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.detune.setValueAtTime((this.melodyStep % 3) * 3, now);
    filter.type = "bandpass";
    filter.frequency.value = frequency * 2.2;
    filter.Q.value = 5.5;
    pan.pan.value = Math.sin(this.melodyStep * 0.9) * 0.28;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(pan);
    pan.connect(this.ambienceGain);
    this.autoDisposeNode(oscillator, [oscillator, filter, gain, pan]);

    oscillator.start(now);
    oscillator.stop(now + 0.68);
    this.melodyStep += 1;
  }

  private stopAmbient(): void {
    this.stopMusicElement();

    if (this.melodyTimer !== null) {
      window.clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }

    this.ambienceNodes.forEach((node) => {
      if ("stop" in node && typeof node.stop === "function") {
        try {
          node.stop();
        } catch {
          // no-op
        }
      }

      try {
        node.disconnect();
      } catch {
        // no-op
      }
    });

    this.ambienceNodes = [];
  }

  private stopMusicElement(): void {
    if (!this.musicElement) {
      return;
    }

    this.musicElement.pause();
    this.musicElement.removeAttribute("src");
    this.musicElement.load();
    this.musicElement = null;
    this.currentTrackIndex = -1;
  }

  private autoDisposeNode(node: AudioScheduledSourceNode, connections: AudioNode[]): void {
    node.addEventListener(
      "ended",
      () => {
        connections.forEach((connection) => {
          try {
            connection.disconnect();
          } catch {
            // no-op
          }
        });
      },
      { once: true },
    );
  }

  private createEnvelopeOscillator(
    kind: OscillatorType,
    frequency: number,
    gainLevel: number,
    duration: number,
    destination: GainNode,
    detune = 0,
  ): void {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = kind;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(destination);
    this.autoDisposeNode(oscillator, [oscillator, gain]);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
  }

  private playToneLayer(layer: ToneLayer): void {
    const context = this.ensureContext();
    if (!context || !this.sfxGain) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const pan = context.createStereoPanner();
    const startAt = context.currentTime + (layer.delay ?? 0);
    const attack = layer.attack ?? 0.02;

    oscillator.type = layer.kind;
    oscillator.frequency.setValueAtTime(layer.frequency, startAt);
    oscillator.detune.setValueAtTime(layer.detune ?? 0, startAt);
    filter.type = layer.filterType ?? "allpass";
    filter.frequency.value = layer.filterFrequency ?? layer.frequency * 2;
    filter.Q.value = layer.filterQ ?? 1;
    pan.pan.value = layer.pan ?? 0;

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(layer.gain, startAt + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + layer.duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(pan);
    pan.connect(this.sfxGain);
    this.autoDisposeNode(oscillator, [oscillator, filter, gain, pan]);

    oscillator.start(startAt);
    oscillator.stop(startAt + layer.duration + 0.05);
  }

  private playNoiseLayer(layer: NoiseLayer): void {
    const context = this.ensureContext();
    const sfxGain = this.sfxGain;
    if (!context || !sfxGain) {
      return;
    }

    const buffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * layer.duration)), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * Math.exp(-index / (layer.decay ?? data.length * 0.72));
    }

    (layer.repeats ?? [layer.delay ?? 0]).forEach((offset) => {
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const pan = context.createStereoPanner();
      const startAt = context.currentTime + offset;

      source.buffer = buffer;
      filter.type = layer.filterType;
      filter.frequency.value = layer.filterFrequency;
      filter.Q.value = layer.filterQ ?? 1;
      pan.pan.value = layer.pan ?? 0;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(layer.gain, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + layer.duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(pan);
      pan.connect(sfxGain);
      this.autoDisposeNode(source, [source, filter, gain, pan]);

      source.start(startAt);
      source.stop(startAt + layer.duration + 0.02);
    });
  }

  private playRitualStage(profile: RitualSoundProfile, stage: keyof RitualSoundProfile): void {
    const context = this.ensureContext();
    if (!context || !this.sfxGain || !this.settings?.sfxEnabled) {
      return;
    }

    const stageProfile = profile[stage];
    stageProfile.tones?.forEach((layer) => this.playToneLayer(layer));
    stageProfile.noises?.forEach((layer) => this.playNoiseLayer(layer));
  }

  playBell(sceneId?: string): void {
    this.playRitualStage(getRitualSoundProfile(sceneId), "bell");
  }

  playTubeShake(sceneId?: string): void {
    this.playRitualStage(getRitualSoundProfile(sceneId), "shake");
  }

  playPaper(sceneId?: string): void {
    this.playRitualStage(getRitualSoundProfile(sceneId), "paper");
  }

  playRitualPreview(sceneId?: string): void {
    this.playRitualStage(getRitualSoundProfile(sceneId), "preview");
  }
}

export const omamoriAudio = new OmamoriAudioEngine();
