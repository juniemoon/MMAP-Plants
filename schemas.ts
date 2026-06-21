import { z } from "zod";

export const PlantSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  location: z.string().min(1, "Standort ist erforderlich"),
  status: z.enum(["unknown", "healthy", "sick", "recovering", "critical"]),
  wateringMinWeeks: z.number().min(0.5, "Mindestens 0.5 Wochen"),
  wateringMaxWeeks: z.number().min(0.5, "Mindestens 0.5 Wochen"),
  sunlight: z.string().min(1, "Lichtbedarf angeben").max(150),
  humidity: z.coerce.number({ error: "Bitte eine Zahl zwischen 0 und 100 eingeben" }).min(0, "Mindestens 0%").max(100, "Maximal 100%"),
  illness: z.string().optional().nullable(),
  image: z.any().optional(),
}).refine(
  (data) => data.wateringMaxWeeks >= data.wateringMinWeeks,
  {
    message: "Maximum muss größer oder gleich Minimum sein",
    path: ["wateringMaxWeeks"],
  }
);;

export type PlantInput = z.infer<typeof PlantSchema>;

export const WateringLogSchema = z.object({
  plantId: z.number(),
  waterAmount: z.coerce.number().positive().optional().nullable(),
  note: z.string().optional().nullable(),
  wateredAt: z.date().optional(),
});

export type WateringLogInput = z.infer<typeof WateringLogSchema>;