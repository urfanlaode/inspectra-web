export const snakeCaseString = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export type SnakeCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Lowercase<First>}${SnakeCaseInner<Rest>}`
  : S

type SnakeCaseInner<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${SnakeCaseInner<Rest>}`
    : `_${Lowercase<First>}${SnakeCaseInner<Rest>}`
  : ''

export type DeepSnakeCase<T> = T extends readonly (infer U)[]
  ? DeepSnakeCase<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? SnakeCase<K> : K]: DeepSnakeCase<T[K]>
      }
    : T

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === 'object' &&
  Object.prototype.toString.call(value) === '[object Object]'

export const toSnake = <T>(input: T): DeepSnakeCase<T> => {
  if (Array.isArray(input)) {
    return input.map((item) => toSnake(item)) as unknown as DeepSnakeCase<T>
  }

  if (isPlainObject(input)) {
    const result: Record<string, unknown> = {}

    for (const key in input as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const value = (input as Record<string, unknown>)[key]
        result[snakeCaseString(key)] = toSnake(value) as unknown
      }
    }

    return result as DeepSnakeCase<T>
  }

  return input as unknown as DeepSnakeCase<T>
}
