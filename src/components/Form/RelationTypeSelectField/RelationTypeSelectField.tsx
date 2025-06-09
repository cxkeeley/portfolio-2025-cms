import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { RelationTypeEnum } from '@models/base'
import { Option } from '@models/option'

import { SelectField, SelectFieldProps } from '@components/Form/Select'

type RelationTypeSelectFieldProps = Omit<SelectFieldProps, 'options'>

const RelationTypeSelectField: FC<RelationTypeSelectFieldProps> = (props) => {
  const intl = useIntl()
  const options: Array<Option> = useMemo(
    () =>
      Object.values(RelationTypeEnum).map(
        (relationType) =>
          new Option({
            label: intl.formatMessage({ id: `enum.relation_type.${relationType.toLowerCase()}` }),
            value: relationType,
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

export { RelationTypeSelectField }
