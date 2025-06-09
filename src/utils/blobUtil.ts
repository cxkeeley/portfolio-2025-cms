interface IBlobUtil {
  toBase64: (blob: Blob) => Promise<string>

  download: (blob: Blob, filename?: string) => void
}

const BlobUtil: IBlobUtil = {
  toBase64: (blob: Blob): Promise<string> => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise<string>((resolve, reject) => {
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target?.result) {
          if (ev.target.result instanceof ArrayBuffer) {
            resolve(Buffer.from(ev.target.result).toString('base64'))
          } else {
            resolve(ev.target.result)
          }
        } else {
          reject(new Error('Empty Result'))
        }
      }

      reader.onerror = (ev: ProgressEvent<FileReader>) => reject(ev.target?.error)
    })
  },

  download: (blob, filename): void => {
    const url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.setAttribute('style', 'display: none')
    a.href = url

    if (filename) {
      a.download = filename
    }

    document.body.appendChild(a)
    a.click()

    // Delay revoking the URL to ensure the file download is initiated
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    a.remove()
  },
}

export default BlobUtil
