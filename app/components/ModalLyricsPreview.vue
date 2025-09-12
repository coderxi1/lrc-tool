<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps<{ lyrics: Lyrics; song: Song; close:()=>void }>()

const settings = reactive({
  lyrics: {
    original: { enable: true, weight: 1 },
    translation: { enable: true, weight: 2 },
    romanization: { enable: false, weight: 3 },
  },
  meta: {
    enable: true,
  },
  filetype: 'lrc'
})

const filetypeOptions = Lrc.FORMAT_TYPES.map(t => ({ value: t, label: '.' + t }))

const filters = reactive([
  {
    name: '移除空白行',
    enable: true,
    weight: 1,
    func: (line: LrcLine, lrc: Lrc) => {
      return line.raw.trim() && line.text.trim()
    }
  },
  {
    name: '移除重复行',
    enable: true,
    weight: 2,
    func: (line: LrcLine, lrc: Lrc) => {
      return lrc.lines.some(l => l.raw === line.raw)
    }
  },
  {
    name: '从歌词中提取META',
    enable: true,
    weight: 3,
    func: (line: LrcLine, lrc: Lrc) => {
      for (const [key_meta, key_regex] of Object.entries({
        arranger: "编曲",
        composer: "作?曲",
        lyricist: "作?词",
        producer: "制作人",
      })) {
        const match = line.text.match(new RegExp(`(${key_regex})\\s*[:：]\\s*(.+)`))
        if (match && !lrc.meta[key_meta]) {
          lrc.meta[key_meta] = match[2]!.trim()
          return false
        }
      }
      return true
    }
  }
])

const lrcValue = ref<string>('')
const textareaValue = ref<string>()
watch([props.lyrics, settings, filters], lrcUpdate, { immediate: true })

function lrcUpdate() {
  let lrc = new Lrc();
  ObjectUtil.assign(lrc.meta, {
    ti: props.song.name,
    ar: props.song.artists?.join(','),
    al: props.song.album,
    subtitle: props.song.alias?.replace(/[\(\)（）]/g, '')
  })
  ObjectUtil.keys(props.lyrics).forEach(key => {
    const lyric = props.lyrics[key]
    const lyricSetting = settings.lyrics[key]
    if (lyricSetting.enable) {
      lrc.concat(lyric, lyricSetting.weight);
    }
  })

  filters.filter(f => f.enable).sort((a, b) => b.weight - a.weight).forEach(filter => {
    lrc.lines = lrc.lines.filter(line => filter.func(line, lrc))
  })

  lrcValue.value = lrc.format({to:'lrc',meta: settings.meta.enable})
  textareaValue.value = lrc.format({ to: settings.filetype, meta: settings.meta.enable })
}

const save = async () => saveTextAsFile(textareaValue.value || '', {
  filename: `${props.song.artists?.join(',')} - ${props.song.title}`,
  extension: settings.filetype,
  description: '歌词文件'
})

const toEditor = () => {
  const id = `${props.song.platform}${props.song.platformId}`.toUpperCase()
  const editorStore = useEditorStore()
  editorStore.newLyricFile(id, `${props.song.artists?.join(',')} - ${props.song.title}`, lrcValue.value)
  useRouter().push('/editor?id=' + id)
}
</script>

<template>
  <VueFinalModal class="flex justify-center items-center py5 md:py0"
    content-class="h-full md:h-180 w-full md:w-250 relative p-4 rounded-lg bg-white dark:bg-dark "
    content-transition="vfm-fade" overlay-transition="vfm-fade">
    
    <div class="flex flex-col gap2 mb2 text-dark dark:text-light h-full">
      <div class="flex flex-col-reverse md:flex-row">
        <SongSummary :song="song" class="flex-1" />
        <div class="flex justify-end text-dark dark:text-light min-w-20">
          <button class="btn-circle flex flex-col text-xs" @click="toEditor">
            <Icon name="mdi:file-document-arrow-right-outline" class="w6 h6" />编辑
          </button>
          <button class="btn-circle flex flex-col text-xs" @click="close">
            <Icon name="mdi:close" class="w6 h6" />关闭
          </button>
        </div>
      </div>
      <div class="block md:flex gap2">
        <h2>歌词设置</h2>
        <div class="flex gap2">
          <MyCheckbox v-model="settings.lyrics.original.enable" label="原文" />
          <MyCheckbox v-model="settings.lyrics.translation.enable" label="翻译" />
          <MyCheckbox v-model="settings.lyrics.romanization.enable" label="罗马音" />
          <MyCheckbox v-model="settings.meta.enable" label="META" />
        </div>
      </div>
      <div class="md:flex gap2">
        <h2>过滤设置</h2>
        <div class="md:flex gap2">
          <MyCheckbox v-for="(filter, index) in filters" :key="index" v-model="filter.enable" :label="filter.name" />
        </div>
      </div>
      <MyTextarea v-model="textareaValue" class="flex-1 "></MyTextarea>
      <div class="flex gap2 justify-end">
        <MySelect v-model="settings.filetype" placeholder="文件格式" :options="filetypeOptions" class="w30" />
        <button class="flex gap2 items-center py2 px4 bg-maincolor text-white dark:text-black rounded-lg" @click="save">
          <Icon name="mdi:content-save" class="w5 h5" />
          保存
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
