export const getRedirectUrl = async (url: string | URL) => (await (await fetch(`/api/redirect?url=${url.toString()}`)).json()).url

export const saveTextAsFile = async (text: string, { filename, extension, description = 'Text File' }: { filename: string; extension: string; description: string }) => {
  if (isMobile()) {
    return saveTextAsFileMobile(text,{filename,extension})
  }
  try {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: filename + '.' + extension,
      types: [{ description, accept: { 'text/plain': ['.' + extension] } }],
    })
    const writable = await handle.createWritable()
    await writable.write(text)
    await writable.close()
  } catch {}
}

export const isMobile = () => {
  const ua = navigator.userAgent;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) || ('ontouchstart' in window && screen.width < 1024);
}
export const saveTextAsFileMobile = async (text: string, { filename, extension }: { filename: string; extension: string; }) => {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })), download: filename + '.' + extension });
  a.click();
  URL.revokeObjectURL(a.href);
}