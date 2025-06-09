interface IStringUtil {
  generateUUID4: () => string

  capitalize: (text: string, delimiter?: string) => string

  truncate: (text: string, charToShow: number) => string

  textToSha256HashHex: (text: string) => Promise<string>
}

const StringUtil: IStringUtil = {
  generateUUID4: () => {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => {
      const a = parseInt(c)
      return (a ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (a / 4)))).toString(16)
    })
  },

  capitalize: (text, delimiter = '') => {
    const parts = text.split(delimiter)

    return parts
      .map((part) => {
        let temp = part
        if (part.length > 0) {
          temp = part[0].toUpperCase() + part.slice(1).toLowerCase()
        }
        return temp
      })
      .join(delimiter)
  },

  truncate: (text, charToShow) => {
    if (text) {
      if (text.length > charToShow) {
        return text.substring(0, charToShow) + ' ...'
      }
      return text
    }
    return ''
  },

  textToSha256HashHex: async (text) => {
    const msgUint8 = new TextEncoder().encode(text) // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
    return hashHex
  },
}

export default StringUtil
