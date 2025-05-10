import { z } from "zod";

export const divarUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://divar.ir/s/"), {
    message: "URL Invalid",
  });
