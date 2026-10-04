import { ActivityLog } from '../types';
import { StorageService, StorageKeys } from './storage';

export const activityService = {
  // Obter feed de atividades recentes
  async getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
    const activities = StorageService.get<ActivityLog[]>(StorageKeys.ACTIVITIES, []);
    return activities.slice(0, limit);
  },

  // Registrar nova atividade
  async logActivity(activity: ActivityLog): Promise<void> {
    const activities = StorageService.get<ActivityLog[]>(StorageKeys.ACTIVITIES, []);
    activities.unshift(activity);
    // Manter até 50 atividades
    if (activities.length > 50) {
      activities.length = 50;
    }
    StorageService.set(StorageKeys.ACTIVITIES, activities);
  }
};
