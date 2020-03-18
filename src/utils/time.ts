function parseNumber(num: number) {
  return num < 10 ? '0' + num : num
}
export function formatDate(time: string | number | Date) {
  if (!time) {
    return ''
  } else {
    const date = new Date(time)
    const Y = date.getFullYear()
    const M = parseNumber(date.getMonth() + 1)
    const D = parseNumber(date.getDate())
    const h = parseNumber(date.getHours())
    const m = parseNumber(date.getMinutes())
    const s = parseNumber(date.getSeconds())
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
}
