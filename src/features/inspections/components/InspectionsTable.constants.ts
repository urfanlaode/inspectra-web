const columns = [
  { label: 'Request No.', key: 'inspectionNo' },
  { label: 'Location', key: 'locationName' },
  { label: 'Scope of Work', key: 'scopeOfWorkName' },
  { label: 'Type', key: 'serviceTypeName' },
  { label: 'Date Submitted', key: 'dateSubmitted' },
  { label: 'ECD', key: 'estimatedCompletionDate' },
  { label: 'Status', key: 'status' }
]

const lotColumns = [
  { label: 'Item Description', key: 'itemName' },
  { label: 'Ownership', key: 'ownership' },
  { label: 'Lot No.', key: 'lotNo' },
  { label: 'Qty', key: 'qty' },
  { label: 'Progress', key: 'progress' }
]

export const inspectionsTableMeta = {
  columns,
  lotColumns
}
