import clsx from 'clsx'
import { CSSProperties, FC } from 'react'
import CE, { ContentEditableEvent } from 'react-contenteditable'

type ContentEditableProps = {
  variant?: 'solid' | 'outline'
  value: string
  onChange: (value: string) => void
  isDisabled?: boolean
}

const ContentEditable: FC<ContentEditableProps> = ({ value, onChange, isDisabled, variant = 'solid' }) => {
  const style: CSSProperties = {
    minHeight: 120,
  }

  const handleChange = (event: ContentEditableEvent) => {
    onChange(event.target.value)
  }

  return (
    <CE
      style={style}
      html={value}
      disabled={isDisabled}
      onChange={handleChange}
      className={clsx('form-control flex-grow-1 mb-3 mb-lg-0', {
        'form-control-solid': variant === 'solid',
      })}
    />
  )
}

export type { ContentEditableProps }
export { ContentEditable }
