import { FC } from 'react'
import { useIntl } from 'react-intl'

type Props = {
  value: number
}

const FormatNumber: FC<Props> = ({ value }) => {
  const intl = useIntl()

  return <>{intl.formatNumber(value)}</>
}

export { FormatNumber }
