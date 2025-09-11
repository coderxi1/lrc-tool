import { usePlatform } from "~~/server/platforms"

export default defineEventHandler(async (event) => {
  const platform = usePlatform(event.context.params!.platform)
  const id = event.context.params!.id
  switch (event.context.params!.entity) {
    case "album": return platform.getAlbumById(id)
    case "playlist": return platform.getPlaylistById(id)
    case "song": return platform.getSongById(id)
    case "lyrics": return platform.getLyricsBySongId(id)
  }
})
