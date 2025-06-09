import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { ReligionEnum } from '@models/base'
import { Option } from '@models/option'

import { SelectField, SelectFieldProps } from '@components/Form/Select'

type ReligionSelectFieldProps = Omit<SelectFieldProps, 'options'>

const ReligionSelectField: FC<ReligionSelectFieldProps> = (props) => {
  const intl = useIntl()

  const options: Array<Option> = useMemo(
    () =>
      Object.values(ReligionEnum).map(
        (religion) =>
          new Option({
            label: intl.formatMessage({ id: `enum.religion.${religion.toLowerCase()}` }),
            value: religion,
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

export { ReligionSelectField }
