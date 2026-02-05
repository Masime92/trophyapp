
import { Game, Achievement } from './types';

export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'Elden Ring',
    platform: 'Steam',
    coverUrl: 'https://picsum.photos/seed/elden/300/450',
    completionRate: 85,
    totalAchievements: 42,
    unlockedAchievements: 36,
    lastPlayed: '2024-05-20'
  },
  {
    id: '2',
    title: 'Cyberpunk 2077',
    platform: 'Epic',
    coverUrl: 'https://picsum.photos/seed/cyber/300/450',
    completionRate: 45,
    totalAchievements: 56,
    unlockedAchievements: 25,
    lastPlayed: '2024-05-18'
  },
  {
    id: '3',
    title: 'The Witcher 3: Wild Hunt',
    platform: 'GOG',
    coverUrl: 'https://picsum.photos/seed/witcher/300/450',
    completionRate: 100,
    totalAchievements: 78,
    unlockedAchievements: 78,
    lastPlayed: '2023-12-15'
  }
];

export const MOCK_ACHIEVEMENTS: Record<string, Achievement[]> = {
  '1': [
    {
      id: 'a1',
      name: 'Elden Lord',
      description: 'Reached the "Elden Lord" ending.',
      icon: 'https://picsum.photos/seed/a1/64/64',
      isUnlocked: true,
      isMissable: false,
      isOnline: false,
      isSecret: false,
      rarity: 15.2
    },
    {
      id: 'a2',
      name: 'Age of the Stars',
      description: 'Reached the "Age of the Stars" ending.',
      icon: 'https://picsum.photos/seed/a2/64/64',
      isUnlocked: false,
      isMissable: true,
      isOnline: false,
      isSecret: true,
      rarity: 12.8
    },
    {
      id: 'a3',
      name: 'Shardbearer Mohg',
      description: 'Defeated Shardbearer Mohg.',
      icon: 'https://picsum.photos/seed/a3/64/64',
      isUnlocked: true,
      isMissable: false,
      isOnline: false,
      isSecret: true,
      rarity: 25.1
    }
  ]
};
