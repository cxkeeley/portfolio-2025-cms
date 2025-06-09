import { FC } from 'react'
import { default as DP, ReactDatePickerProps } from 'react-datepicker'

import { DatepickerHeader } from './components/DatepickerHeader'
import { DatePickerInputField } from './components/DatepickerInput'
import { DatepickerInputTime } from './components/DatepickerInputTime'

const DATETIME_FORMAT = 'dd MMM yyyy HH:mm'
const DATE_FORMAT = 'dd MMM yyy'

type DatePickerProps = ReactDatePickerProps & {
  variant?: 'solid' | 'outline'
  onClear?: () => void
}

const DatePicker: FC<DatePickerProps> = ({ variant, onClear, isClearable, ...props }) => {
  return (
    <DP
      dateFormat={props.showTimeInput ? DATETIME_FORMAT : DATE_FORMAT}
      useWeekdaysShort
      showPopperArrow={false}
      popperProps={{
        strategy: 'fixed',
      }}
      renderCustomHeader={(headerProps) => <DatepickerHeader {...headerProps} />}
      customInput={
        <DatePickerInputField
          onClear={onClear}
          variant={variant}
          isClearable={isClearable}
        />
      }
      customTimeInput={<DatepickerInputTime />}
      {...props}
    />
  )
}

export type { DatePickerProps }

export { DatePicker }
