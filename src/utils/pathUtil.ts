interface IPathUtil {
  clean: (path: string) => string

  toAbsoluteURL: (path: string) => string
}

const PathUtil: IPathUtil = {
  clean: (path) => {
    return path.split(/[?#]/)[0]
  },

  toAbsoluteURL: (path: string) => {
    const prefix = path.startsWith('/') ? '' : '/'
    return process.env.PUBLIC_URL + prefix + path
  },
}

export default PathUtil
