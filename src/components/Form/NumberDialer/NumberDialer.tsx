import clsx from 'clsx'
import { FC, useCallback, useMemo } from 'react'
import Stack from 'react-bootstrap/Stack'

import TypeUtil from '@/utils/typeUtil'

import { NumberMaskInput, NumberMaskInputOptions, NumberMaskInputProps } from '../NumberMaskInput'
import { MinusButton } from './components/MinusButton'
import { PlusButton } from './components/PlusButton'

const DEFAULT_OPTIONS: NumberMaskInputOptions = {
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  allowMinus: false,
}

export type NumberDialerProps = Omit<NumberMaskInputProps, 'value'> & {
  value: number
}

const NumberDialer: FC<NumberDialerProps> = ({ value, onChange, options, variant = 'outline', ...props }) => {
  const mergedOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
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

  return (
    <Stack
      gap={2}
      direction="horizontal"
    >
      <MinusButton
        className="flex-shrink-0"
        disabled={
          props.isDisabled || (TypeUtil.isDefined(options) && TypeUtil.isDefined(options.min) && value <= options.min)
        }
        onClick={() => decrease()}
      />

      <NumberMaskInput
        {...props}
        className={clsx('text-center', props.className)}
        variant={variant}
        options={mergedOptions}
        value={value}
        onChange={(v) => {
          onChange?.(Number(v))
        }}
      />

      <PlusButton
        className="flex-shrink-0"
        disabled={
          props.isDisabled || (TypeUtil.isDefined(options) && TypeUtil.isDefined(options.max) && value >= options.max)
        }
        onClick={() => increase()}
      />
    </Stack>
  )
}

export { NumberDialer }
