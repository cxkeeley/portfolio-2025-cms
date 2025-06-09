import clsx from 'clsx'
import { FC } from 'react'
import Badge, { BadgeProps } from 'react-bootstrap/Badge'

type KTbadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'
  | 'light-primary'
  | 'light-secondary'
  | 'light-success'
  | 'light-danger'
  | 'light-warning'
  | 'light-info'
  | 'light-dark'

export type KTBadgeProps = React.PropsWithChildren<
  Omit<BadgeProps, 'bg'> & {
    variant?: KTbadgeVariant
    size?: 'sm' | 'lg'
    shape?: 'circle' | 'square'
    outline?: boolean
  }
>

const ModifiedBadge = Object.create(Badge)
ModifiedBadge.defaultProps = {
  pill: false,
}

const KTBadge: FC<KTBadgeProps> = ({ variant, size, shape, outline, children, className, ...props }) => {
  const mergedClassName = clsx(
    className,
    variant && `badge-${variant}`,
    shape && `badge-${shape}`,
    outline && `badge-${outline}`,
    size && `badge-${size}`
  )

  return (
    <ModifiedBadge
      {...props}
      className={mergedClassName}
    >
      {children}
    </ModifiedBadge>
  )
}

KTBadge.defaultProps = {
  variant: 'light-primary',
}

export { KTBadge }
