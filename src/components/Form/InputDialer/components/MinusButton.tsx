import { forwardRef } from 'react'

type Props = React.HTMLProps<HTMLButtonElement>

const MinusButton = forwardRef<HTMLButtonElement, Props>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="btn btn-icon bg-gray-200 w-25px h-25px position-absolute"
      style={{ top: 10, left: 10 }}
      type="button"
    >
      <i className="fa-solid fa-minus"></i>
    </button>
  )
})

export { MinusButton }
