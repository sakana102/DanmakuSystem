import { SettingsSchema, type Settings } from "@/utils/types/settings";

export class StorageManager {
  private storage;

  constructor(key: string) {
    this.storage = storage.defineItem<Settings>(`local:${key}`, {
      fallback: SettingsSchema.parse({}),
    });
  }

  async get(): Promise<Settings> {
    return await this.storage.getValue();
  }

  async getItem<K extends keyof Settings, P extends keyof Settings[K]>(key: K, platform: P): Promise<Settings[K][P]> {
    const value = await this.get();
    return value[key][platform];
  }

  async set(settings: Settings): Promise<void> {
    await this.storage.setValue(settings);
  }

  async setItem<K extends keyof Settings, P extends keyof Settings[K]>(
    key: K,
    platform: P,
    item: Settings[K][P],
  ): Promise<void> {
    const value = await this.get();
    await this.storage.setValue({
      ...value,
      [key]: {
        ...value[key],
        [platform]: item,
      },
    });
  }

  public watch(callback: (settings: Settings) => void): () => void {
    return this.storage.watch(callback);
  }

  public watchItem<K extends keyof Settings, P extends keyof Settings[K]>(
    key: K,
    platform: P,
    callback: (newValue: Settings[K][P]) => void,
  ): () => void {
    return this.storage.watch((newValue, oldValue) => {
      const newItem = newValue[key][platform];
      const oldItem = oldValue[key][platform];
      if (JSON.stringify(newItem) !== JSON.stringify(oldItem)) {
        callback(newItem);
      }
    });
  }
}
