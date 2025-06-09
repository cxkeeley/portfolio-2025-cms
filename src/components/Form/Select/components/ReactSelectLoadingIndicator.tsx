import { LoadingIndicatorProps } from 'react-select'

import { Option } from '@models/option'

const ReactSelectLoadingIndicator = <Opt = Option,>(props: LoadingIndicatorProps<Opt>) => {
  return <div className="spinner-border spinner-border-sm text-gray-600 me-2"></div>
}

export { ReactSelectLoadingIndicator }
