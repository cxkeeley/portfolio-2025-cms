import clsx from 'clsx'
import { FC } from 'react'
import { useIntl } from 'react-intl'

type Props = {
  colSpan: number
  className?: string
}

const TableRowEmpty: FC<Props> = ({ colSpan, className }) => {
  const intl = useIntl()

  const bodyClassName = clsx(className, 'text-center w-100 py-2')

  return (
    <tr>
      <td colSpan={colSpan}>
        <div className={bodyClassName}>
          <i className="fa-solid fa-inbox fs-3hx mb-2 text-muted" />
          <div className="text-muted">{intl.formatMessage({ id: 'table.no_data' })}</div>
        </div>
      </td>
    </tr>
  )
}

export { TableRowEmpty }
