import { z } from 'zod'

export const inspectionItemLotSchema = z.object({
  allocationId: z.any().optional(),
  ownerId: z.any().optional(),
  conditionId: z.any().optional(),
  availableQty: z.any().optional(),
  inspectionItemId: z.number().int().nonnegative().optional(),
  lotId: z.number().int().min(1, 'Lot is required'),
  qtyRequired: z
    .number({
      message: 'Quantity required must be a number'
    })
    .min(1, 'Quantity required must be at least 1')
})

export const inspectionItemSchema = z.object({
  inspectionId: z.number().int().nonnegative().optional(),
  itemId: z.number().int().min(1, 'Item is required'),
  qtyRequested: z
    .number({
      message: 'Quantity must be a number'
    })
    .min(1, 'Quantity must be at least 1'),
  lots: z.array(inspectionItemLotSchema).optional()
})

export const inspectionSchema = z.object({
  status: z.string().optional(),
  serviceTypeId: z.number().int().min(1, 'Service type is required').optional(),
  scopeOfWorkId: z.number().int().min(1, 'Scope of work is required').optional(),
  locationId: z.number().int().min(1, 'Location is required').optional(),
  estimatedCompletionDate: z.string().nonempty('Invalid estimated completion date').optional(),
  dcCode: z.string().optional(),
  items: z.array(inspectionItemSchema).min(1, 'At least one inspection item is required'),
  note: z.string().optional(),
  isCustomerCharged: z.boolean(),
  customerId: z.number().int().min(1, 'Customer is required').optional()
})

export type InspectionSchema = z.infer<typeof inspectionSchema>
export type InspectionItemSchema = z.infer<typeof inspectionItemSchema>
export type InspectionItemLotSchema = z.infer<typeof inspectionItemLotSchema>
