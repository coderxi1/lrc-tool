import * as netease from '../adapters/netease'
import * as qq from '../adapters/qq'

export const platforms = { netease, qq }

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as SearchRequestQuery
  const platform = platforms[query.platform]
  return platform.search(query)
})
