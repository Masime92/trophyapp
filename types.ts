
export type Platform = 'Steam' | 'Epic' | 'GOG';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  isMissable: boolean;
  isOnline: boolean;
  isSecret: boolean;
  rarity: number; // percentage
}

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  coverUrl: string;
  completionRate: number;
  totalAchievements: number;
  unlockedAchievements: number;
  lastPlayed: string;
}

export interface UserSession {
  platforms: Partial<Record<Platform, boolean>>;
  expiresAt: number;
  userId?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AIPlanningStep {
  title: string;
  description: string;
  isWarning: boolean;
  isOptional: boolean;
  achievements: string[];
}

export interface TrophyRoute {
  steps: AIPlanningStep[];
  warnings: string[];
}
