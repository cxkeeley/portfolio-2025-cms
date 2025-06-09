import { ChangeEvent, FC, useEffect, useState } from 'react'

type Props = {
  year: number
  onChange: (year: number) => void
}

const DatepickerHeaderYear: FC<Props> = ({ year, onChange }) => {
  const [value, setValue] = useState<number>(new Date().getFullYear())

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let nextValue = Number(e.target.value)

    if (nextValue === 0) {
      nextValue = new Date().getFullYear()
    }

    setValue(nextValue)
    onChange(nextValue)
  }

  useEffect(() => {
    setValue(year)
  }, [year])

  return (
    <div className="react-datepicker__current-year">
      <input
        type="number"
        className="react-datepicker__year-input"
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export { DatepickerHeaderYear }
