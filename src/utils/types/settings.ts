import { z } from "zod";
import { createPlatformObject } from "@/utils/types/platform";

export const SettingsSchema = z.object({
  enable: createPlatformObject(z.boolean()).default({
    youtube: true,
    twitch: true,
    kick: true,
    openrec: true,
    twicas: true,
  }),

  decoration: createPlatformObject(z.boolean()).default({
    youtube: true,
    twitch: true,
    kick: true,
    openrec: true,
    twicas: true,
  }),

  fontFamily: createPlatformObject(z.string()).default({
    youtube: "",
    twitch: "",
    kick: "",
    openrec: "",
    twicas: "",
  }),

  fontSize: createPlatformObject(z.number()).default({
    youtube: 28,
    twitch: 28,
    kick: 28,
    openrec: 28,
    twicas: 28,
  }),

  fontOpacity: createPlatformObject(z.number()).default({
    youtube: 50,
    twitch: 50,
    kick: 50,
    openrec: 50,
    twicas: 50,
  }),

  displayTime: createPlatformObject(z.number()).default({
    youtube: 10,
    twitch: 10,
    kick: 10,
    openrec: 10,
    twicas: 10,
  }),

  displayLimit: createPlatformObject(z.number()).default({
    youtube: 0,
    twitch: 0,
    kick: 0,
    openrec: 0,
    twicas: 0,
  }),

  displayRange: createPlatformObject(z.number()).default({
    youtube: 100,
    twitch: 100,
    kick: 100,
    openrec: 100,
    twicas: 100,
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;
