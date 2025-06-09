import clsx from 'clsx'
import { FC } from 'react'
import { useIntl } from 'react-intl'

type Props = {
  intlMessage?: string
  alignCenter?: boolean
}

export const IntlCell: FC<Props> = ({ intlMessage, alignCenter }) => {
  const intl = useIntl()

  return (
    <div
      className={clsx({
        'text-center': alignCenter,
      })}
    >
      {intl.formatMessage({ id: intlMessage })}
    </div>
  )
}
