import { FC, useId } from 'react'

type RadioButtonProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  value: string | number
  label?: string
}

const RadioButton: FC<RadioButtonProps> = ({ label, ...props }) => {
  const id = useId()

  return (
    <div className="form-check form-check-custom form-check-solid">
      <input
        {...props}
        className="form-check-input"
        type="radio"
        id={id}
      />
      <label
        className="form-check-label fs-6"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}

export type { RadioButtonProps }

export { RadioButton }
