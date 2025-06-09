import clsx from 'clsx'
import Inputmask from 'inputmask'
import { ChangeEvent, forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react'

import { useI18n } from '@modules/i18n/contexts/I18nContext'
import { Language } from '@modules/i18n/models'

export type RefMaskInputField = {
  clearValue: () => void
}

type Locale = {
  [key in Language]: {
    radixPoint: string
    groupSeparator: string
  }
}

type DefaultProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'autoFocus' | 'onBlur' | 'onFocus' | 'className'
>

type MaskInputProps = DefaultProps & {
  acceptRaw?: boolean
  options: Inputmask.Options
  onChange: (value: string) => void
  variant?: 'outline' | 'solid'
  isDisabled?: boolean
}

const locales: Locale = {
  id: {
    radixPoint: ',',
    groupSeparator: '.',
  },
  en: {
    radixPoint: '.',
    groupSeparator: ',',
  },
}

const MaskInput = forwardRef<RefMaskInputField, MaskInputProps>(
  ({ options, onChange, acceptRaw = true, variant = 'solid', ...inputProps }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { language } = useI18n()
    const radixPoint = locales[language].radixPoint
    const groupSeparator = locales[language].groupSeparator

    useImperativeHandle(ref, () => ({
      clearValue: () => {
        inputRef.current?.inputmask?.setValue('')
      },
    }))

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      if (acceptRaw) {
        value = e.target.inputmask?.unmaskedvalue() ?? value
        if (value && options.alias === 'decimal') {
          value = value.replaceAll(radixPoint, '.')
        }
      }

      if (onChange) {
        onChange(value)
      }
    }

    useEffect(() => {
      const maskInstance = Inputmask({
        ...options,
        groupSeparator,
        radixPoint,
        onBeforeMask: (value) => value,
        onKeyDown: (e) => {
          if (options.alias === 'decimal' && e.key === groupSeparator) {
            e.preventDefault()
          }
        },
      })

      if (inputRef.current) {
        maskInstance.mask(inputRef.current)
      }

      return () => maskInstance.remove()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <input
        ref={inputRef}
        {...inputProps}
        onChange={handleChange}
        className={clsx(
          'form-control mb-3 mb-lg-0',
          variant === 'solid' && 'form-control-solid',
          inputProps.className,
          {
            'border-end-0': inputProps.isDisabled,
          }
        )}
        autoComplete="off"
      />
    )
  }
)

export type { MaskInputProps }

export { MaskInput }
