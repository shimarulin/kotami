export function getKeyByValue(object: Record<string, string | number>, value: string | number) {
  return Object.keys(object).find(key => object[key] === value)
}
