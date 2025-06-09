import { useField } from 'formik'
import { FC } from 'react'

import { TimeInput, TimeInputProps } from './TimeInput'

type Props = TimeInputProps & {
  name: string
}

const TimeInputField: FC<Props> = ({ name, variant = 'solid', ...props }) => {
  const [field] = useField(name)

  return (
    <TimeInput
      {...field}
      {...props}
    />
  )
}

export { TimeInputField }
