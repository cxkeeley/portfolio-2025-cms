import clsx from 'clsx'
import Inputmask from 'inputmask'
import { ChangeEvent, forwardRef, useMemo } from 'react'

type DefaultOptionsProps = Pick<Inputmask.Options, 'step' | 'groupSeparator' | 'radixPoint' | 'allowMinus'>

type NumberMaskInputOptions = DefaultOptionsProps & {
  min?: number
  max?: number
}

type NumberMaskInputProps = {
  value?: string | number
  variant?: 'solid' | 'outline'
  onChange?: (value: number) => void
  className?: string
  isDisabled?: boolean
  options?: NumberMaskInputOptions
}

const NumberMaskInput = forwardRef<HTMLInputElement, NumberMaskInputProps>(
  ({ value, variant = 'solid', onChange, options: opts, isDisabled, ...props }, ref) => {
    const className = clsx('form-control mb-3 mb-lg-0', props.className, {
      'border-end-0': isDisabled,
      'form-control-solid': variant === 'solid',
    })

    const options = useMemo<Inputmask.Options>(
      () => ({
        alias: 'numeric',
        allowMinus: false,
        rightAlign: false,
        greedy: true,
        unmaskAsNumber: true,
        groupSeparator: ',',
        radixPoint: '.',
        ...opts,
      }),
      [opts]
    )

    const maskedValue = useMemo(() => {
      const parsedValue = value?.toString() || ''

      return Inputmask.format(parsedValue, options)
    }, [options, value])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Inputmask.unmask(e.target.value, options)

      if (onChange) {
        onChange(newValue as unknown as number)
      }
    }

    return (
      <input
        ref={ref}
        {...props}
        disabled={isDisabled}
        value={maskedValue}
        onChange={handleChange}
        className={className}
        autoComplete="off"
      />
    )
  }
)

export type { NumberMaskInputOptions, NumberMaskInputProps }

export { NumberMaskInput }
