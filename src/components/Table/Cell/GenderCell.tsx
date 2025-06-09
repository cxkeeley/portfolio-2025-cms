import { FC } from 'react'
import { useIntl } from 'react-intl'

import { GenderEnum } from '@models/base'

type Props = {
  gender: GenderEnum
}

export const GenderCell: FC<Props> = ({ gender }) => {
  const intl = useIntl()

  return <>{intl.formatMessage({ id: `enum.gender.${gender}` })}</>
}
