import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react'

type Ref = HTMLInputElement

type Props = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> & {
  onChange?: (value: string) => void
}

const DatepickerInputTime = forwardRef<Ref, Props>(({ onChange, ...props }, ref) => {
  return (
    <div className="position-relative d-flex align-items-center">
      <div className="react-datepicker-time__input-icon">
        <i className="fa fa-clock fs-5" />
      </div>
      <input
        ref={ref}
        {...props}
        onChange={(e) => onChange && onChange(e.target.value)}
        type="time"
        className="form-control form-control-solid"
      />
    </div>
  )
})
export { DatepickerInputTime }
