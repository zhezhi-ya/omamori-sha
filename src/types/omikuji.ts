export type FortuneCategory =
  | "study"
  | "love"
  | "slacking"
  | "lateNight"
  | "social"
  | "wealth"
  | "hidden";

export type FortuneTier =
  | "small-blessing"
  | "middle-blessing"
  | "great-blessing"
  | "shadow"
  | "secret";

export type FortuneRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export type OmamoriRouteId =
  | "hakurei"
  | "scarlet"
  | "eientei"
  | "moriya-shrine"
  | "hakugyokurou"
  | "forest-of-magic"
  | "myouren-temple"
  | "palace-of-earth-spirits"
  | "sanzu-river"
  | "misty-lake"
  | "human-village"
  | "sunflower-field"
  | "divine-spirit-mausoleum"
  | "nameless-hill";

export type OmamoriRouteTextTone = "shrine" | "mansion" | "moon";

export type SceneCandidateStatus = "active" | "locked";

export interface OmamoriRouteCopyLabels {
  heading: string;
  quote: string;
  summary: string;
  advice: string;
  luckyColor: string;
  luckyItem: string;
  motif: string;
  rare: string;
  channel: string;
  inspiration: string;
}

export interface OmamoriRouteVisualTokens {
  ink: string;
  accent: string;
  secondary: string;
  shadow: string;
  surface: string;
  glow: string;
  particle: string;
}

export interface RitualAssetSet {
  ritualBase: string;
  paperClosed: string;
  paperEmerging: string;
  paperOpen: string;
  fxParticles: string;
  fxReveal: string;
  resultCorner: string;
  sourceSheet: string;
}

export interface OmamoriRouteConfig {
  id: OmamoriRouteId;
  label: string;
  shortLabel: string;
  subtitle: string;
  description: string;
  cardDescription: string;
  cornerLabel: string;
  enterLabel: string;
  drawLabel: string;
  revisitLabel: string;
  backLabel: string;
  statusIdle: string;
  resultTitle: string;
  shareFrom: string;
  sceneImage: string;
  textureImage?: string;
  ornamentImage?: string;
  stageOverlayImage?: string;
  ritualImage?: string;
  ritualAssets: RitualAssetSet;
  textTone: OmamoriRouteTextTone;
  visual: OmamoriRouteVisualTokens;
  copyLabels: OmamoriRouteCopyLabels;
  stage: {
    eyebrow: string;
    title: string;
    description: string;
    ringing: string;
    shaking: string;
    revealing: string;
    rareNotice: string;
    favoriteAdded: string;
    favoriteRemoved: string;
  };
}

export interface SceneCandidate {
  id: string;
  label: string;
  subtitle: string;
  status: SceneCandidateStatus;
  sceneImage: string;
  ritualImage?: string;
  ritualAssets?: RitualAssetSet;
  routeId?: OmamoriRouteId;
  description: string;
  cardDescription: string;
  cornerLabel: string;
  animationPlan?: string;
  ritualPlan?: {
    tool: string;
    paper: string;
    reveal: string;
    ambientMotion: string;
    sound: string;
    assetPrompt: string;
  };
  sourceNotes?: string[];
  visual: OmamoriRouteVisualTokens;
}

export interface Fortune {
  id: string;
  category: FortuneCategory;
  tier: FortuneTier;
  title: string;
  character: string;
  alias?: string;
  inspiration?: string;
  archetype?: string;
  characterImage?: string;
  characterImageSource?: string;
  relatedSceneIds?: string[];
  quote?: string;
  motif?: string;
  summary: string;
  advice: string;
  luckyColor: string;
  luckyItem: string;
  tags: string[];
  rarity: FortuneRarity;
  unlockedVisualTheme?: string;
}

export interface OmikujiCategory {
  id: FortuneCategory;
  label: string;
  subtitle: string;
  accent: string;
  glow: string;
  motif: string;
}

export interface DailyDrawRecord {
  dateKey: string;
  drawnAt: string;
  fortune: Fortune;
  routeId?: OmamoriRouteId;
}

export interface SavedFortune extends Fortune {
  savedAt: string;
  routeId?: OmamoriRouteId;
}

export interface OmamoriSettings {
  ambienceEnabled: boolean;
  sfxEnabled: boolean;
  ambienceVolume: number;
  sfxVolume: number;
  reduceMotion: boolean;
  defaultRouteId: OmamoriRouteId;
  askRouteOnLaunch: boolean;
}

export type NoticeTone = "success" | "info" | "error";

export interface SceneNotice {
  id: string;
  tone: NoticeTone;
  title: string;
  message?: string;
}
