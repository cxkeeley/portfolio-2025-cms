import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import Stack from 'react-bootstrap/Stack'

type OTPInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'className'> & {
  shouldAutoFocus?: boolean
  variant?: 'solid' | 'outline'
  format?: string
  onChange: (value: string) => void
}

type CodeType = {
  key: number
  status: 'input' | 'symbol'
  value: string
}

type Props = {
  activeInput: number
  code: CodeType
  variant?: 'solid' | 'outline'
  className?: string
  disabled?: boolean
  setActiveInput: (num: number) => void
  onChange: (value: string) => void
}

const CodeInput: FC<Props> = ({ activeInput, code, variant, className, disabled, setActiveInput, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select()
    setActiveInput(code.key)
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return

    if (e.key === 'Backspace') {
      setActiveInput(code.key - 1)
      onChange('')
    } else if (e.key === 'Delete') {
      onChange('')
    } else if (e.key === 'ArrowLeft') {
      setActiveInput(code.key - 1)
    } else if (e.key === 'ArrowRight') {
      setActiveInput(code.key + 1)
    } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      setActiveInput(code.key + 1)
      onChange(e.key)
    }

    e.preventDefault()
  }

  useEffect(() => {
    if (activeInput === code.key) {
      inputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeInput])

  return (
    <input
      type="text"
      disabled={disabled}
      ref={inputRef}
      className={clsx(
        'form-control text-center w-45px',
        {
          'form-control-solid': variant === 'solid',
        },
        className
      )}
      maxLength={1}
      defaultValue={code.value}
      onFocus={handleFocus}
      onKeyDown={handleKeydown}
    />
  )
}

const OTPInput: FC<OTPInputProps> = ({
  variant = 'solid',
  format = '###-###',
  shouldAutoFocus = false,
  className,
  disabled,
  onChange,
}) => {
  const [codes, setCodes] = useState<Array<CodeType>>(() => {
    let key = -1
    return format.split('').map((c) => {
      if (c === '#') {
        key += 1
        return { key: key, status: 'input', value: '' }
      } else {
        return { key: -1, status: 'symbol', value: c }
      }
    })
  })

  const [activeInput, setActiveInput] = useState<number>(shouldAutoFocus ? 0 : -1)

  const handleChange = async (value: string, key: number) => {
    let result = ''

    await setCodes((prev) => {
      const newCodes = prev.map((code) => {
        if (code.key !== key) return code

        return {
          ...code,
          value,
        }
      })

      result = newCodes
        .filter((c) => c.status === 'input')
        .map((c) => c.value)
        .join('')

      return newCodes
    })

    onChange(result)
  }

  return (
    <Stack
      gap={5}
      direction="horizontal"
    >
      {codes.map((code, i) => {
        if (code.status === 'input') {
          return (
            <CodeInput
              key={i}
              className={className}
              disabled={disabled}
              activeInput={activeInput}
              code={code}
              variant={variant}
              setActiveInput={setActiveInput}
              onChange={(value) => handleChange(value, code.key)}
            />
          )
        } else {
          return (
            <span
              key={i}
              className="form-control bg-body border-0 d-flex justify-content-center fs-4 w-20px"
            >
              {code.value}
            </span>
          )
        }
      })}
    </Stack>
  )
}

export type { OTPInputProps }

export { OTPInput }
