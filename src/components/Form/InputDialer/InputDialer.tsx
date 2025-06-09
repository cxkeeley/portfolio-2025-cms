import { FC, useCallback, useEffect, useMemo, useRef } from 'react'

import {
  NumberMaskInput,
  NumberMaskInputOptions,
  NumberMaskInputProps,
} from '@components/Form/NumberMaskInput/NumberMaskInput'

import TypeUtil from '@/utils/typeUtil'

import { MinusButton } from './components/MinusButton'
import { PlusButton } from './components/PlusButton'

export type InputDialerProps = Omit<NumberMaskInputProps, 'value'> & {
  value: number
  keyboard?: boolean
}

const defaultOptions: NumberMaskInputOptions = {
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  allowMinus: false,
}

const InputDialer: FC<InputDialerProps> = ({ value, onChange, options, keyboard: hasKeyboardEvent, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const mergedOptions = useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    [options]
  )

  const increase = useCallback(() => {
    const oldValue = value
    let newValue = value + mergedOptions.step!

    if (TypeUtil.isDefined(mergedOptions.max) && newValue > mergedOptions.max) {
      newValue = mergedOptions.max
    }

    if (oldValue !== newValue) {
      onChange?.(newValue)
    }
  }, [mergedOptions.max, mergedOptions.step, onChange, value])

  const decrease = useCallback(() => {
    const oldValue = value
    let newValue = value - mergedOptions.step!

    if (TypeUtil.isDefined(mergedOptions.min) && newValue < mergedOptions.min) {
      newValue = mergedOptions.min
    }

    if (!mergedOptions.allowMinus && newValue < 0) {
      newValue = 0
    }

    if (oldValue !== newValue) {
      onChange?.(newValue)
    }
  }, [mergedOptions.allowMinus, mergedOptions.min, mergedOptions.step, onChange, value])

  useEffect(() => {
    const handleKeyDown = (ev: globalThis.KeyboardEvent) => {
      switch (ev.key) {
        case 'ArrowUp':
          ev.preventDefault()
          increase()
          break
        case 'ArrowDown':
          ev.preventDefault()
          decrease()
          break
      }
    }

    const inputEl = inputRef.current

    if (hasKeyboardEvent) {
      inputEl?.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (hasKeyboardEvent) {
        inputEl?.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [decrease, hasKeyboardEvent, increase])

  return (
    <div className="position-relative">
      <MinusButton
        onClick={() => decrease()}
        disabled={TypeUtil.isDefined(options) && TypeUtil.isDefined(options.min) && value <= options.min}
      />

      <NumberMaskInput
        ref={inputRef}
        {...props}
        options={mergedOptions}
        value={value}
        onChange={(v) => {
          onChange?.(Number(v))
        }}
      />

      <PlusButton
        onClick={() => increase()}
        disabled={TypeUtil.isDefined(options) && TypeUtil.isDefined(options.max) && value >= options.max}
      />
    </div>
  )
}

export { InputDialer }
