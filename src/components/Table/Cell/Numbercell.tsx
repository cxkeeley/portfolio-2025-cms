import { FC } from 'react'
import { useIntl } from 'react-intl'

type Props = {
  num: number
}

export const NumberCell: FC<Props> = ({ num }) => {
  const intl = useIntl()

  return <div className="text-end">{intl.formatNumber(num)}</div>
}
