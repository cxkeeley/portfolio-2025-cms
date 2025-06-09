import { useField } from 'formik'
import { FC } from 'react'

import { Checkbox, CheckboxProps } from './Checkbox'

type Props = CheckboxProps & {
  name: string
}

const CheckboxField: FC<Props> = (props) => {
  const [field] = useField(props.name)

  return (
    <Checkbox
      {...props}
      {...field}
    />
  )
}

export { CheckboxField }
