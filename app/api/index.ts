import netease from './platforms/netease'
import qq from './platforms/qq'

export const platforms = { netease, qq }
export const usePlatform = (name?: string) => {
  if (!name || !Object.keys(platforms).includes(name))
    throw new Error(`不支持的音乐平台: [${name}] !`)
  return platforms[name as keyof typeof platforms]
}
