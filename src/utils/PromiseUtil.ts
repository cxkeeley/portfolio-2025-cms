import debounce from 'lodash.debounce'

interface IPromiseUtil {
  debounce: <T>(
    fn: (inputVal: string, ...additionalArgs: Array<unknown>) => Promise<T>,
    delayMs: number
  ) => (inputVal: string) => Promise<T>

  delay: (timeMs: number) => Promise<void>
}

const PromiseUtil: IPromiseUtil = {
  debounce: (fn, delayMs) => {
    const lodashDebounce = debounce((resolve, reject, args: string, ...additionalArgs: Array<unknown>) => {
      fn(args, ...additionalArgs)
        .then(resolve)
        .catch(reject)
    }, delayMs)

    return (inputVal: string, ...additionalArgs: Array<unknown>) => {
      return new Promise((resolve, reject) => {
        lodashDebounce(resolve, reject, inputVal, ...additionalArgs)
      })
    }
  },

  delay: function (timeMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeMs))
  },
}

export default PromiseUtil
