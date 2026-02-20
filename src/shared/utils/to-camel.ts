export const camelCaseString = (str: string) => {
  return str.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())
}

type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S

export type Camelize<T> = T extends readonly (infer U)[]
  ? Camelize<U>[]
  : T extends object
    ? T extends (...args: unknown[]) => unknown
      ? T
      : { [K in keyof T as K extends string ? CamelCase<K> : K]: Camelize<T[K]> }
    : T

export const toCamel = <T>(input: T): Camelize<T> => {
  if (Array.isArray(input)) {
    return (input as unknown as unknown[]).map((item) => toCamel(item)) as unknown as Camelize<T>
  }

  if (
    input &&
    typeof input === 'object' &&
    Object.prototype.toString.call(input) === '[object Object]'
  ) {
    const result: Record<string, unknown> = {}

    const recordInput = input as Record<string, unknown>
    for (const key in recordInput) {
      if (Object.prototype.hasOwnProperty.call(recordInput, key)) {
        const camelKey = camelCaseString(key)
        result[camelKey] = toCamel(recordInput[key] as unknown)
      }
    }

    return result as Camelize<T>
  }

  return input as unknown as Camelize<T>
}
