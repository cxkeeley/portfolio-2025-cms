import { FC } from 'react'
import { Accept } from 'react-dropzone'
import { useIntl } from 'react-intl'

import FileUtil from '@/utils/fileUtil'

type Props = {
  maxSize?: number
  accept?: Accept
}

const DropzoneHelperText: FC<Props> = ({ maxSize, accept }) => {
  const intl = useIntl()

  return (
    <div className="form-text text-muted">
      {(maxSize || accept) && <span>{`* `}</span>}

      {maxSize && (
        <span>
          {intl.formatMessage({ id: 'patient_document.allowed_size' })}
          {FileUtil.relativeSize(maxSize)}
        </span>
      )}

      {maxSize && accept && <span>{intl.formatMessage({ id: 'patient_document.and' })}</span>}

      {accept && (
        <span>
          {intl.formatMessage({ id: 'patient_document.allowed_type' })}
          {Object.values(accept)
            .map((type) => type.map((ex) => ' ' + ex))
            .toString()}
        </span>
      )}
    </div>
  )
}

export { DropzoneHelperText }
