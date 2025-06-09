import React from 'react'
import { FormattedMessage } from 'react-intl'

type Props = {
}

const EmptyPlaceholderText: React.FC<Props> = () => {
  return (
    <span className="fw-normal text-muted fst-italic">
      <FormattedMessage id="vocabulary.empty" />
    </span>
  )
}

export default EmptyPlaceholderText
