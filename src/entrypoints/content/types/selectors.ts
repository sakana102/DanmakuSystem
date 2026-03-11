import { z } from "zod";
import { createPlatformObject } from "@/utils/types/platform";

export const SelectorsSchema = z.object({
  video: z.object({
    canvas: createPlatformObject(z.string()),
  }),

  chat: z.object({
    cell: createPlatformObject(z.string()),
    contents: createPlatformObject(z.string()),
    messages: createPlatformObject(z.string()),
    emotes: createPlatformObject(z.string()),
  }),
});

export type Selectors = z.infer<typeof SelectorsSchema>;
