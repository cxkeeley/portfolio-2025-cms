import clsx from 'clsx'
import { forwardRef } from 'react'

import { KTSVG } from '../KTSVG'

type EmptyContentPlaceholderIllustrationProps = JSX.IntrinsicElements['div']

type HeadingInstrinsicElements = Pick<JSX.IntrinsicElements, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>

type EmptyContentPlaceholderTitleProps<K extends keyof HeadingInstrinsicElements> = HeadingInstrinsicElements[K] & {
  As: K
}

const Illustration = forwardRef<React.ElementRef<'div'>, EmptyContentPlaceholderIllustrationProps>((props, ref) => {
  return (
    <div
      {...props}
      ref={ref}
    >
      <KTSVG
        path="/media/illustrations/no-data.svg"
        svgClassName="w-100px h-100px"
      />
    </div>
  )
})

const Title = <K extends keyof HeadingInstrinsicElements>({
  As,
  children,
  className,
  ...props
}: EmptyContentPlaceholderTitleProps<K>) => {
  const Component = As as React.ElementType

  return (
    <Component
      {...props}
      className={clsx(className, 'text-muted')}
    >
      {children}
    </Component>
  )
}

const EmptyContentPlaceholder = Object.assign(
  {},
  {
    Illustration,
    Title,
  }
)

export default EmptyContentPlaceholder
