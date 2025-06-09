import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { BloodTypeEnum } from '@models/base'
import { Option } from '@models/option'

import { SelectField, SelectFieldProps } from '@components/Form/Select'

type BloodTypeSelectFieldProps = Omit<SelectFieldProps, 'options'>

const BloodTypeSelectField: FC<BloodTypeSelectFieldProps> = (props) => {
  const intl = useIntl()

  const options: Array<Option> = useMemo(
    () =>
      Object.values(BloodTypeEnum).map(
        (bloodType) =>
          new Option({
            label: bloodType,
            value: bloodType,
          })
      ),
    []
  )

  return (
    <SelectField
      {...props}
      options={options}
      noOptionsMessage={() => intl.formatMessage({ id: 'select.no_option' })}
    />
  )
}

export { BloodTypeSelectField }
