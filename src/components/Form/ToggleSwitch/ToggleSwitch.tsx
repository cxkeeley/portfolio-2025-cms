import { FC } from 'react'

type DefaultProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'checked'>

export type ToggleSwitchProps = DefaultProps

export const ToggleSwitch: FC<ToggleSwitchProps> = (props) => {
  return (
    <label className=" form-check form-switch form-check-custom form-check-solid">
      <input
        {...props}
        type="checkbox"
        className="form-check-input force-transition"
        autoComplete="off"
      />
    </label>
  )
}
