export const isNumber = (str: string) => /^[0-9]+$/.test(str)
export const isUrl = (str: string) => /^(https?:\/\/[^\s]+)$/.test(str)

export class ObjectUtil {
  static keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[]
  }
  static assign(target: any, source: any) {
    Object.entries(source).reduce((t, [k, v]) => (v ? ((t[k] = v), t) : t), target)
  }
}
export const fetchJson = async <T = Record<string, any>>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`请求出错: ${response.status}`)
  }
  return await response.json()
}
