import { FC } from 'react'
import { useIntl } from 'react-intl'

import { GenderEnum } from '@models/base'

import { RadioButtonGroupField, RadioButtonGroupProps } from '@components/Form/RadioButtonGroup'

type Props = Omit<RadioButtonGroupProps, 'value' | 'options' | 'onChange'>

const GenderRadioButtonField: FC<Props> = (props) => {
  const intl = useIntl()

  return (
    <RadioButtonGroupField
      {...props}
      options={[
        {
          label: intl.formatMessage({
            id: `enum.gender.${GenderEnum.MALE}`,
          }),
          value: GenderEnum.MALE,
        },
        {
          label: intl.formatMessage({
            id: `enum.gender.${GenderEnum.FEMALE}`,
          }),
          value: GenderEnum.FEMALE,
        },
      ]}
    />
  )
}

export { GenderRadioButtonField }
