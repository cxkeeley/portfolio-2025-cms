import { FC, useState } from 'react'

import { KTSVG } from '@components/KTSVG'

import { useDebounce, useFirstTimeEffect } from '@/hooks'

type Props = {
  onChange: (phrase?: string) => void
  initialValue?: string
  placeholder?: string
  delay?: number
  width?: number
}

const SearchBar: FC<Props> = ({ onChange, initialValue, placeholder, width, delay = 300 }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue ?? '')

  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  useFirstTimeEffect(
    (isFirst) => {
      if (!isFirst) {
        onChange(debouncedSearchTerm)
      }
    },
    [debouncedSearchTerm]
  )

  return (
    <div
      className="d-flex align-items-center position-relative my-1"
      style={{ width }}
    >
      <KTSVG
        path="/media/icons/duotune/general/gen021.svg"
        className="svg-icon-1 position-absolute ms-4"
      />

      <input
        type="text"
        className="form-control form-control-solid ps-14"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

export { SearchBar }
