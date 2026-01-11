import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Food, FoodLog } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  FOODS: 'foods',
  FOOD_LOGS: 'food_logs',
};

export class StorageService {
  // User Profile
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    }
  }

  static async clearUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error('Error clearing user profile:', error);
      throw error;
    }
  }

  // Foods
  static async saveFoods(foods: Food[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods));
    } catch (error) {
      console.error('Error saving foods:', error);
      throw error;
    }
  }

  static async getFoods(): Promise<Food[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOODS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading foods:', error);
      throw error;
    }
  }

  static async addFood(food: Food): Promise<void> {
    try {
      const foods = await this.getFoods();
      foods.push(food);
      await this.saveFoods(foods);
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  }

  static async deleteFood(foodId: string): Promise<void> {
    try {
      const foods = await this.getFoods();
      const filtered = foods.filter(f => f.id !== foodId);
      await this.saveFoods(filtered);
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  }

  // Food Logs
  static async saveFoodLogs(logs: FoodLog[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving food logs:', error);
      throw error;
    }
  }

  static async getFoodLogs(): Promise<FoodLog[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading food logs:', error);
      throw error;
    }
  }

  static async addFoodLog(log: FoodLog): Promise<void> {
    try {
      const logs = await this.getFoodLogs();
      logs.push(log);
      await this.saveFoodLogs(logs);
    } catch (error) {
      console.error('Error adding food log:', error);
      throw error;
    }
  }

  static async deleteFoodLog(logId: string): Promise<void> {
    try {
      const logs = await this.getFoodLogs();
      const filtered = logs.filter(l => l.id !== logId);
      await this.saveFoodLogs(filtered);
    } catch (error) {
      console.error('Error deleting food log:', error);
      throw error;
    }
  }

  static async getFoodLogsForDate(date: string): Promise<FoodLog[]> {
    try {
      const logs = await this.getFoodLogs();
      return logs.filter(log => log.date === date);
    } catch (error) {
      console.error('Error loading food logs for date:', error);
      throw error;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.FOODS,
        STORAGE_KEYS.FOOD_LOGS,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}
