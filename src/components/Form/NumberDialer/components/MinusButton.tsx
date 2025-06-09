import clsx from 'clsx'
import { forwardRef } from 'react'

type Props = React.HTMLProps<HTMLButtonElement>

const MinusButton = forwardRef<HTMLButtonElement, Props>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        'btn btn-icon w-20px h-20px border rounded-circle',
        {
          'border-primary': !props.disabled,
        },
        className
      )}
      type="button"
    >
      <i
        className={clsx('fa-solid fa-minus fs-8', {
          'text-primary': !props.disabled,
        })}
      />
    </button>
  )
})

export { MinusButton }
