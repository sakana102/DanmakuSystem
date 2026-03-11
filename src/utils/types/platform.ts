import { z } from "zod";

export const PlatformSchema = z.enum(["youtube", "twitch", "kick", "openrec", "twicas"]);
export type Platform = z.infer<typeof PlatformSchema>;

export const createPlatformObject = <T extends z.ZodTypeAny>(itemSchema: T) => {
  const shape = PlatformSchema.options.reduce(
    (acc, platform) => {
      acc[platform] = itemSchema;
      return acc;
    },
    {} as Record<Platform, T>,
  );

  return z.object(shape);
};
