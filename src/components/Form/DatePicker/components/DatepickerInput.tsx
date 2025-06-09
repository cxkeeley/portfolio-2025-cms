import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes } from 'react'

import { KTSVG } from '@components/KTSVG'

type Ref = HTMLInputElement

type Props = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'outline' | 'solid'
  onClear?: () => void
  isClearable?: boolean
}

const DatePickerInputField = forwardRef<Ref, Props>(({ variant = 'solid', isClearable, onClear, ...props }, ref) => {
  return (
    <div className="position-relative d-flex align-items-center">
      <KTSVG
        path={'/media/icons/duotune/general/gen014.svg'}
        className="svg-icon svg-icon-2 position-absolute start-0 mx-4"
      />
      <input
        ref={ref}
        {...props}
        readOnly
        value={props.value}
        type="text"
        className={clsx('form-control px-13', {
          'form-control-solid': variant === 'solid',
          'bg-body': variant === 'outline',
        })}
      />

      {!props.disabled && isClearable && props.value && (
        <button
          type="button"
          onClick={onClear}
          className="btn btn-icon btn-color-gray-600 w-20px h-20px position-absolute end-0 mx-4"
          style={{
            zIndex: 0,
          }}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  )
})
export { DatePickerInputField }
