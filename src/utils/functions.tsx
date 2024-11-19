export function capitalizeWords(name: string) {
  if (typeof name !== 'string' || name.length === 0) {
    return name
  }
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
