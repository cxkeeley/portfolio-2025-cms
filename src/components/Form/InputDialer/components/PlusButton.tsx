import { forwardRef } from 'react'

type Props = React.HTMLProps<HTMLButtonElement>

const PlusButton = forwardRef<HTMLButtonElement, Props>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="btn btn-icon bg-gray-200 w-25px h-25px position-absolute"
      style={{ top: 10, right: 10 }}
      type="button"
    >
      <i className="fa-solid fa-plus"></i>
    </button>
  )
})

export { PlusButton }
