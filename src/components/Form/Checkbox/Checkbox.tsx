import { FC, useId } from 'react'

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string | number
  label?: string
}

export const Checkbox: FC<CheckboxProps> = ({ label, ...props }) => {
  const id = useId()

  return (
    <div className="form-check form-check-custom form-check-solid">
      <input
        {...props}
        id={id}
        className="form-check-input cursor-pointer"
        type="checkbox"
      />

      {label && (
        <label
          className="form-check-label"
          htmlFor={id}
        >
          {label}
        </label>
      )}
    </div>
  )
}
