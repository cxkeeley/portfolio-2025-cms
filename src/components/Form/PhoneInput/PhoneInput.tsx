import { FC } from 'react'
import ReactPhoneInput, { CountryData } from 'react-phone-input-2'

type PhoneInputProps = {
  value?: string
  onChange: (value: string | null) => void
  isClearable?: boolean
  disabled?: boolean
}

const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, isClearable, disabled }) => {
  const countryCode = '+62'
  const isShowClearableButton = value && isClearable && value.length > 3
  const parsedValue = value?.startsWith(countryCode) ? value : `+${countryCode}${value}`

  const handleChange = (nextValue: string, data: CountryData) => {
    if (nextValue.length === data.countryCode.length) {
      onChange(null)
    } else {
      onChange(`+${nextValue}`)
    }
  }

  return (
    <div className="position-relative d-flex align-items-center">
      <ReactPhoneInput
        value={parsedValue}
        onChange={handleChange}
        inputClass="form-control form-control-solid pe-13"
        country="id"
        onlyCountries={['id']}
        preferredCountries={['id']}
        placeholder={`${countryCode} (8XX) XXXX-XXXX`}
        masks={{ id: '(...) ....-....' }}
        countryCodeEditable={false}
        disabled={disabled}
      />

      {isShowClearableButton && (
        <button
          type="button"
          className="btn btn-icon btn-color-gray-600 w-20px h-20px position-absolute end-0 mx-4"
          onClick={() => onChange(null)}
        >
          <i className="fa-solid fa-times" />
        </button>
      )}
    </div>
  )
}

export type { PhoneInputProps }

export { PhoneInput }
