import { z } from "zod";

export const PlatformSchema = z.enum(["youtube", "twitch", "kick", "openrec", "twicas"]);
export type Platform = z.infer<typeof PlatformSchema>;
