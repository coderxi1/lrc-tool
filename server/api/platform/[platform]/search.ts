import { usePlatform } from "~~/server/platforms"

export default defineEventHandler(async (event) => {
  const platform = usePlatform(event.context.params?.platform)
  return platform.search(getQuery(event).keyword as string, Object.fromEntries(event.headers.entries()))
})
