import { z } from "zod";

export const PlantSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  location: z.string().min(1, "Standort ist erforderlich"),
  status: z.enum(["idk", "healthy", "sick", "recovering", "critical"]),
  wateringMinWeeks: z.number().min(0.5, "Mindestens 0.5 Wochen"),
  wateringMaxWeeks: z.number().min(0.5, "Mindestens 0.5 Wochen"),
  sunlight: z.string().min(1, "Lichtbedarf angeben").max(150),
  humidity: z.number().min(0, "Mindestens 0%").max(100, "Maximal 100%"),
  illness: z.string().optional().nullable(),
  image: z.any().optional(),
}).refine(
  (data) => data.wateringMaxWeeks >= data.wateringMinWeeks,
  {
    message: "Maximum muss größer oder gleich Minimum sein",
    path: ["wateringMaxWeeks"],
  }
);

export type PlantInput = z.infer<typeof PlantSchema>;

export const WateringLogSchema = z.object({
  plantId: z.number(),
  waterAmount: z.number().positive().optional().nullable(),
  note: z.string().optional().nullable(),
  wateredAt: z.date().optional(),
});

export type WateringLogInput = z.infer<typeof WateringLogSchema>;

export const FertilizingLogSchema = z.object({
  plantId: z.number(),
  fertilizerType: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  fertilizedAt: z.date().optional(),
});

export type FertilizingLogInput = z.infer<typeof FertilizingLogSchema>;

export const RepottingLogSchema = z.object({
  plantId: z.number(),
  repottedAt: z.date().optional(),
  soilType: z.string().optional().nullable(),
  oldPotSize: z.number().positive().optional().nullable(),
  newPotSize: z.number().positive().optional().nullable(),
  plantDivided: z.boolean().optional().nullable(),
  note: z.string().optional().nullable(),
});

export type RepottingLogInput = z.infer<typeof RepottingLogSchema>;