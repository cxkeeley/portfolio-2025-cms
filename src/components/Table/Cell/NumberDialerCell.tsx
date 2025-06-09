import { FC } from 'react'

import { NumberDialer } from '@components/Form/NumberDialer'

type Props = {
  value: number
  min: number
  max?: number
  isDisabled?: boolean
  onChange: (quantity: number) => void
}

const NumberDialerCell: FC<Props> = ({ value, max, isDisabled, onChange, min }) => {
  return (
    <NumberDialer
      value={value}
      isDisabled={isDisabled}
      onChange={onChange}
      options={{
        min,
        max,
        allowMinus: false,
      }}
    />
  )
}

export { NumberDialerCell }
