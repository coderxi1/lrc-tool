export const isNumeric = (str: string) => /^[0-9]+$/.test(str)
export const isUrl = (str: string) => /^(https?:\/\/[^\s]+)$/.test(str)