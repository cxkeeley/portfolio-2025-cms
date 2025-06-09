import clsx from 'clsx'
import { FC, InputHTMLAttributes } from 'react'

export type TimeInputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'solid' | 'outline'
}

const TimeInput: FC<TimeInputProps> = ({ variant = 'solid', ...props }) => {
  return (
    <div className="position-relative d-flex align-items-center">
      <div className="react-datepicker-time__input-icon">
        <i className="fa fa-clock fs-5" />
      </div>
      <input
        {...props}
        type="time"
        className={clsx('form-control', {
          'form-control-solid': variant === 'solid',
        })}
      />
    </div>
  )
}

export { TimeInput }
