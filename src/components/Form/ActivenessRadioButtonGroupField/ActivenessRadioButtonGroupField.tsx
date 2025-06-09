import { useField } from 'formik'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

export type ActivenessRadioGroupButtonFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
}

const ActivenessRadioButtonGroupField: FC<ActivenessRadioGroupButtonFieldProps> = (props) => {
  const [field, , helper] = useField(props)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'All') {
      helper.setValue(undefined)
    } else if (e.target.value === 'Active') {
      helper.setValue(true)
    } else if (e.target.value === 'Non-Active') {
      helper.setValue(false)
    }
  }

  return (
    <div className="d-flex align-items-center">
      <div className="mb-10 me-5">
        <div className="form-check form-check-custom form-check-solid form-check-sm">
          <input
            id="all"
            className="form-check-input"
            type="radio"
            onChange={handleChange}
            value="All"
            checked={field.value === undefined}
            name={props.name}
          />
          <label
            className="form-check-label"
            htmlFor="all"
          >
            <FormattedMessage id="form.radio.all" />
          </label>
        </div>
      </div>

      <div className="mb-10 me-5">
        <div className="form-check form-check-custom form-check-solid form-check-sm">
          <input
            id="active"
            className="form-check-input"
            type="radio"
            onChange={handleChange}
            value="Active"
            checked={field.value === true}
            name={props.name}
          />
          <label
            className="form-check-label"
            htmlFor="active"
          >
            <FormattedMessage id="form.radio.active" />
          </label>
        </div>
      </div>

      <div className="mb-10 me-5">
        <div className="form-check form-check-custom form-check-solid form-check-sm">
          <input
            id="non-active"
            className="form-check-input"
            type="radio"
            onChange={handleChange}
            value="Non-Active"
            checked={field.value === false}
            name={props.name}
          />
          <label
            className="form-check-label"
            htmlFor="non-active"
          >
            <FormattedMessage id="form.radio.non_active" />
          </label>
        </div>
      </div>
    </div>
  )
}
export { ActivenessRadioButtonGroupField }
