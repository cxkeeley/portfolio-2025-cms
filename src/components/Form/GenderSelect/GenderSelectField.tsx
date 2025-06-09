import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { GenderEnum } from '@models/base'
import { Option } from '@models/option'

import { SelectField, SelectFieldProps } from '@components/Form/Select'

type GenderSelectFieldProps = Omit<SelectFieldProps, 'options'>

const GenderSelectField: FC<GenderSelectFieldProps> = (props) => {
  const intl = useIntl()

  const options: Array<Option> = useMemo(
    () =>
      Object.values(GenderEnum).map(
        (gender) =>
          new Option({
            label: intl.formatMessage({
              id: `enum.gender.${gender}`,
            }),
            value: gender,
          })
      ),
    [intl]
  )

  return (
    <SelectField
      {...props}
      options={options}
      noOptionsMessage={() => intl.formatMessage({ id: 'select.no_option' })}
    />
  )
}

export { GenderSelectField }
