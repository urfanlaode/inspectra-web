export interface DropdownParams {
  serviceTypeId?: number
}

export interface DropdownData {
  serviceTypes: ServiceType[]
  scopeOfWorks: ScopeOfWork[]
  locations: Location[]
  allocations: Allocation[]
  itemCategories: ItemCategory[]
  items: Item[]
  owners: Owner[]
  conditions: Condition[]
  uoms: Uom[]
  customers: Customer[]
}

export interface ServiceType {
  id: number
  name: string
}

export interface ScopeOfWork {
  id: number
  name: string
  description: string
  serviceTypeId: number
}

export interface Location {
  id: number
  name: string
}

export interface Allocation {
  id: number
  name: string
}

export interface ItemCategory {
  id: number
  name: string
}

export interface Item {
  id: number
  name: string
  itemCategoryId: number
  itemCategory?: ItemCategory
}

export interface Owner {
  id: number
  name: string
}

export interface Condition {
  id: number
  name: string
}

export interface Uom {
  id: number
  name: string
}

export interface Customer {
  id: number
  name: string
}

export interface Lot {
  id: number
  lotNumber: string
  qty: number
  itemId: number
  allocationId: number
  ownerId: number
  conditionId: number
  uomId: number
  item?: Item
  allocation?: Allocation
  owner?: Owner
  condition?: Condition
  uom?: Uom
}
