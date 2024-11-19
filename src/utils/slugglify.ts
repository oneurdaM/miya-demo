export const slugglify = (str: string): string => {
  // Add random number to avoid conflicts
  return `${str.toLowerCase().replace(/ /g,'-')}-${Math.floor(
    Math.random() * 100000000000
  )}`
}


export const range = (start:any, end:any, step = 1) => {
  const result = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}