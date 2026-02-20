import type {
  Customer,
  Location,
  Lot,
  ScopeOfWork,
  ServiceType
} from '@/features/references/types/reference.types'

export interface InspectionItem {
  inspectionId: number
  itemId: number
  qtyRequested: number
  lots: InspectionItemLot[]
}

export interface InspectionItemLot {
  inspectionItemId: number
  lotId: number
  qtyRequired: number
  lot: Lot
}

export interface Inspection {
  id: number
  inspectionNo: string
  status: string
  serviceTypeId: number
  scopeOfWorkId: number
  locationId: number
  estimatedCompletionDate: string
  dcCode: string
  items: InspectionItem[]
  note: string
  isCustomerCharged: boolean
  customerId: number
  createdAt: string

  serviceType: ServiceType
  scopeOfWork: ScopeOfWork
  lots: InspectionItemLot[]
  location: Location
  customer: Customer
}

export interface StoreInspectionPayload {
  serviceTypeId: number
  scopeOfWorkId: number
  locationId: number
  estimatedCompletionDate: string
  dcCode: string
  items: InspectionItem[]
  note: string
  isCustomerCharged: boolean
  customerId: number
  draft?: boolean
}

export interface GetInspectionsParams {
  status?: string
}
