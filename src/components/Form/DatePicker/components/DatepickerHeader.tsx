import { FC } from 'react'
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker'

import { DatepickerHeaderMonth } from './DatepickerHeaderMonth'
import { DatepickerHeaderYear } from './DatepickerHeaderYear'

const DatepickerHeader: FC<ReactDatePickerCustomHeaderProps> = ({
  date,
  decreaseMonth,
  increaseMonth,
  changeMonth,
  changeYear,
}) => {
  return (
    <div className="react-datepicker__control">
      <span
        className="react-datepicker__control-prev-month"
        onClick={decreaseMonth}
      >
        <span className="fa fa-chevron-left text-body" />
      </span>
      <div className="react-datepicker__current-month">
        <DatepickerHeaderMonth
          month={date.getMonth()}
          onChange={changeMonth}
        />
        <DatepickerHeaderYear
          year={date.getFullYear()}
          onChange={changeYear}
        />
      </div>
      <span
        className="react-datepicker__control-next-month"
        onClick={increaseMonth}
      >
        <span className="fa fa-chevron-right text-body" />
      </span>
    </div>
  )
}

export { DatepickerHeader }
