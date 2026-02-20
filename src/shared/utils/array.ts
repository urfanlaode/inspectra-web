export function findById(listRef: any, id?: number | null) {
  const list = (listRef?.value ?? []) as any[]
  if (!list || id === null || id === undefined) return null
  return list.find((x: any) => x?.id === id) ?? null
}
