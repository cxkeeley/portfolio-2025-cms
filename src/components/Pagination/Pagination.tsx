import clsx from 'clsx'
import RCPagination from 'rc-pagination'
import en from 'rc-pagination/lib/locale/en_US'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

type PaginationProps = {
  total: number
  current: number
  pageSize?: number
  onChange: (page: number) => void
  isDisabled?: boolean
  size?: 'sm' | 'lg'
}

const Pagination: FC<PaginationProps> = ({ current, total, pageSize = 10, isDisabled, onChange, size }) => {
  const itemRenderer = (page: number, type: string) => {
    if (type === 'page') {
      return (
        <button
          type="button"
          className="page-link cursor-pointer"
          disabled={page === 0}
        >
          {page}
        </button>
      )
    } else if (type === 'prev') {
      return (
        <button
          type="button"
          className={clsx('page-link cursor-pointer page-text', {
            'text-muted': page === 0,
          })}
          disabled={page === 0}
        >
          <FormattedMessage id="vocabulary.previous" />
        </button>
      )
    } else if (type === 'next') {
      return (
        <button
          type="button"
          className="page-link cursor-pointer page-text"
        >
          <FormattedMessage id="vocabulary.next" />
        </button>
      )
    }

    return (
      <button
        type="button"
        className="page-link cursor-pointer"
      >
        <i className="fa-solid fa-ellipsis" />
      </button>
    )
  }

  return (
    <RCPagination
      current={current}
      total={total}
      pageSize={pageSize}
      locale={en}
      onChange={(page) => onChange(page)}
      className={clsx('pagination', {
        [`pagination-${size}`]: !!size,
      })}
      itemRender={(page, type) => (
        <div
          key={page}
          className={clsx('page-item', {
            active: type !== 'prev' && type !== 'next' && current === page,
            disabled: isDisabled,
            previous: type === 'prev',
            next: type === 'next',
          })}
        >
          {itemRenderer(page, type)}
        </div>
      )}
    />
  )
}

export type { PaginationProps }

export default Pagination
