import { z } from "zod";

export const cartBoxSchema = z.object({
  boxSizeId: z.string().uuid(),
  flavors: z
    .array(
      z.object({
        flavorId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export const newAddressSchema = z.object({
  label: z.string().trim().max(60).optional(),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional(),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  contactName: z.string().trim().min(1).max(120),
  contactPhone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
});

export const createOrderSchema = z.object({
  boxes: z.array(cartBoxSchema).min(1),
  fulfillmentType: z.enum(["pickup", "delivery"]),
  addressId: z.string().uuid().optional(),
  newAddress: newAddressSchema.optional(),
  notes: z.string().trim().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
