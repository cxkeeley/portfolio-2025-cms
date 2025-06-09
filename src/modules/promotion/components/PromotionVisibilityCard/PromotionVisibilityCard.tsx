import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { RadioButtonGroup } from '@components/Form/RadioButtonGroup'
import { KTCard } from '@components/KTCard'

type Props = {
  isVisible: boolean
  isDisabled?: boolean
  onVisibilityChange: (visibility: boolean) => void
}

const PromotionVisibilityCard: FC<Props> = ({ isVisible, isDisabled, onVisibilityChange }) => {
  const intl = useIntl()
  return (
    <KTCard flush>
      <KTCard.Header>
        <KTCard.Title>
          <FormattedMessage
            id="vocabulary.visibility"
            defaultMessage="Visibility"
          />
        </KTCard.Title>
      </KTCard.Header>

      <KTCard.Body className="py-3">
        <div className="mb-8">
          <RadioButtonGroup
            name="visibility"
            isDisabled={isDisabled}
            onChange={(value) => onVisibilityChange(value === true)}
            value={isVisible}
            options={[
              {
                label: intl.formatMessage({ id: 'vocabulary.visible' }),
                value: true,
              },
              {
                label: intl.formatMessage({ id: 'vocabulary.hidden' }),
                value: false,
              },
            ]}
          />
        </div>
      </KTCard.Body>
    </KTCard>
  )
}

export default PromotionVisibilityCard
