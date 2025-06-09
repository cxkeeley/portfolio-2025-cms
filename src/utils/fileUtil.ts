interface IFileUtil {
  getType: (filename: string) => string | null

  relativeSize: (byte: number) => string

  isAllowed: (fileType: string, allowedFileType: Array<string>) => boolean

  getFilenameFromContentDisposition: (header: string) => string | null
}

const FileUtil: IFileUtil = {
  getType: (filename) => {
    const data = filename.split('.')
    if (data.length > 1) {
      return '.' + data[data.length - 1]
    }
    return null
  },

  relativeSize: (byte) => {
    var i = byte === 0 ? 0 : Math.floor(Math.log(byte) / Math.log(1024))
    return parseFloat((byte / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
  },

  isAllowed: (fileType, allowedFileType) => {
    let result = false
    for (var i = 0; i < allowedFileType.length; i++) {
      if (allowedFileType[i] === fileType.toLowerCase()) {
        result = true
        break
      }
    }
    return result
  },

  getFilenameFromContentDisposition: (header) => {
    const match = header.match(/filename=(?:["']?)([^"']+)["]?/)

    if (!match) {
      return null
    }

    return match[1] ?? null
  },
}

export default FileUtil
