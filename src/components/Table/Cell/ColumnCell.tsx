import clsx from 'clsx'
import { FC, ThHTMLAttributes } from 'react'
import { PropsWithChildren } from 'react'

import { SortDirectionEnum } from '@models/apiBase'

export type ColumnHeaderProps = {
  className?: string
  order?: SortDirectionEnum
  enableSort?: boolean
}

type Props = ThHTMLAttributes<HTMLTableCellElement> &
  ColumnHeaderProps & {
    onSort: () => void
  }

const ColumnCell: FC<PropsWithChildren<Props>> = ({ order, children, className, enableSort, onSort, ...props }) => {
  const handleClick = () => {
    if (enableSort) {
      onSort()
    }
  }

  return (
    <th
      {...props}
      className={clsx(className, {
        [`table-sort-${order}`]: order,
        'cursor-pointer': enableSort,
      })}
      onClick={handleClick}
    >
      {children}
    </th>
  )
}

export { ColumnCell }
