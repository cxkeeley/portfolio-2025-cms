import { ChangeEvent, FC, useEffect, useState } from 'react'

type Props = {
  month: number
  onChange: (month: number) => void
}

const DatepickerHeaderMonth: FC<Props> = ({ month, onChange }) => {
  const [value, setValue] = useState<number>(month)

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(Number(e.target.value))
    onChange(Number(e.target.value))
  }

  useEffect(() => {
    setValue(month)
  }, [month])

  return (
    <select
      className="react-datepicker__month-dropdown-custom"
      value={value}
      onChange={handleChange}
    >
      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>
    </select>
  )
}

export { DatepickerHeaderMonth }
