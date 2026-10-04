// LocalStorage Manager with fallback & typing

const PREFIX = 'kalin_';

export const StorageKeys = {
  USERS: `${PREFIX}users`,
  STUDENTS: `${PREFIX}students`,
  TEACHERS: `${PREFIX}teachers`,
  COURSES: `${PREFIX}courses`,
  MODULES: `${PREFIX}modules`,
  LESSONS: `${PREFIX}lessons`,
  CATEGORIES: `${PREFIX}categories`,
  PROGRESS: `${PREFIX}progress`,
  SESSION: `${PREFIX}session`,
  ACTIVITIES: `${PREFIX}activities`,
  SETTINGS: `${PREFIX}settings`,
  INITIALIZED: `${PREFIX}initialized_v1`
} as const;

export class StorageService {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage`, e);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage`, e);
    }
  }

  static clearAll(): void {
    try {
      Object.values(StorageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.error('Error clearing Kalin storage', e);
    }
  }
}
