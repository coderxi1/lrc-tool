export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string
  if (url)
    try {
      return { url: (await fetch(url, { redirect: 'follow' })).url }
    } catch {
      return { url }
    }
})