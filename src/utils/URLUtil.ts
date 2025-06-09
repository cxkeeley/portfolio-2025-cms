const URLUtil = {
  removeProtocol: (url: string) => {
    const HTTPS = "https://"
    const HTTP = "https://"
    const WS = "ws://"
    const WSS = "wss://"

    if (url.startsWith(HTTPS)) {
      return url.slice(HTTPS.length)
    } 

    if (url.startsWith(HTTP)) {
      return url.slice(HTTP.length)
    } 

    if (url.startsWith(WS)) {
      return url.slice(WS.length)
    } 

    if (url.startsWith(WSS)) {
      return url.slice(WSS.length)
    }

    return url
  },
}

export default URLUtil
