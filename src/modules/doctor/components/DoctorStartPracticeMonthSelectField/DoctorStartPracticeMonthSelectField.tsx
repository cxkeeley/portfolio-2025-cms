import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Option } from '@models/option'

import { SelectField, SelectFieldProps } from '@components/Form/Select'

type DoctorStartPracticeMonthSelectFieldProps = Omit<SelectFieldProps, 'options'>

export const DoctorStartPracticeMonthSelectField: FC<DoctorStartPracticeMonthSelectFieldProps> = (props) => {
  const intl = useIntl()

  const options: Array<Option> = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map(
      (month) =>
        new Option({
          label: intl.formatMessage({ id: `enum.month.${month}` }),
          value: month.toString(),
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
