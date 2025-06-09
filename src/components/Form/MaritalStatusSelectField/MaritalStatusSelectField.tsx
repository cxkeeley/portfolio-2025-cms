import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { MaritalStatusEnum } from '@models/base'
import { Option } from '@models/option'

import { SelectField, SelectFieldProps } from '@components/Form/Select'

type MaritalStatusEnumSelectProps = Omit<SelectFieldProps, 'options'>

export const MaritalStatusSelectField: FC<MaritalStatusEnumSelectProps> = (props) => {
  const intl = useIntl()

  const options: Array<Option> = useMemo(() => {
    return Object.values(MaritalStatusEnum).map(
      (status) =>
        new Option({
          label: intl.formatMessage({
            id: `enum.marital_status.${status.toLowerCase()}`,
          }),
          value: status,
        })
    )
  }, [intl])

  return (
    <SelectField
      {...props}
      options={options}
      noOptionsMessage={() => intl.formatMessage({ id: 'select.no_option' })}
    />
  )
}
