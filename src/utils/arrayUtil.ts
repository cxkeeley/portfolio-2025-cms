interface IArrayUtil {
  reorder: <T>(list: Array<T>, fromIndex: number, destinationIndex: number) => Array<T>
}

const ArrayUtil: IArrayUtil = {
  reorder: <T>(list: Array<T>, fromIndex: number, destinationIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(fromIndex, 1)
    result.splice(destinationIndex, 0, removed)

    return result
  },
}

export default ArrayUtil
