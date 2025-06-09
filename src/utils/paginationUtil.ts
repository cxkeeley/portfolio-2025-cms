import TypeUtil from '@/utils/typeUtil'

interface IPaginationUtil {
  hasNextPage: (total?: number, page?: number, limit?: number) => boolean
}

const PaginationUtil: IPaginationUtil = {
  hasNextPage: (total, page, limit) => {
    return (
      TypeUtil.isDefined(total) &&
      TypeUtil.isDefined(page) &&
      TypeUtil.isDefined(limit) &&
      Math.ceil(total / limit) > page
    )
  },
}

export { PaginationUtil }
