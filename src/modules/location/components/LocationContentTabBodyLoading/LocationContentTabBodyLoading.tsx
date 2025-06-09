import React from 'react'

import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

type Props = {}

const LocationContentTabBodyLoading: React.FC<Props> = () => {
  return (
    <div className="min-h-200px position-relative rounded border">
      <FloatLoadingIndicator />
    </div>
  )
}

export default LocationContentTabBodyLoading
