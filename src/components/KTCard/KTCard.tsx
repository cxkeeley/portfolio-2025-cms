import clsx from 'clsx'
import { FC, forwardRef } from 'react'
import { PropsWithChildren } from 'react'

export type KTCardProps = {
  className?: string
  shadow?: boolean
  flush?: boolean // https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html#flush
  resetSidePaddings?: boolean // https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html#reset-side-paddings
  border?: boolean // https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html#bordered
  dashed?: boolean // https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html#dashed
  stretch?: 'stretch' | 'stretch-75' | 'stretch-50' | 'stretch-33' | 'stretch-25' // https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html#stretch
  rounded?: 'rounded' | 'rounded-top' | 'rounded-bottom'
  // https://preview.keenthemes.com/metronic8/demo1/documentation/base/cards.html#utilities
  utilityP?: number
  utilityPY?: number
  utilityPX?: number
  utilityMB?: number
}

const Card: FC<PropsWithChildren<KTCardProps>> = (props) => {
  const {
    className,
    shadow,
    flush,
    resetSidePaddings,
    border,
    dashed,
    stretch,
    rounded,
    utilityP,
    utilityPY,
    utilityPX,
    utilityMB = 6,
    children,
  } = props
  return (
    <div
      className={clsx(
        'card',
        className && className,
        {
          'shadow-sm': shadow,
          'card-flush': flush,
          'card-px-0': resetSidePaddings,
          'card-bordered': border,
          'card-dashed': dashed,
        },
        stretch && `card-${stretch}`,
        utilityP && `p-${utilityP}`,
        utilityPX && `px-${utilityPX}`,
        utilityPY && `py-${utilityPY}`,
        `mb-${utilityMB}`,
        rounded && `card-${rounded}`
      )}
    >
      {children}
    </div>
  )
}

export type KTCardBodyProps = {
  className?: string
  scroll?: boolean
  height?: number
}

const Body = forwardRef<HTMLDivElement, PropsWithChildren<KTCardBodyProps>>((props, ref) => {
  const { className, scroll, height, children } = props
  return (
    <div
      ref={ref}
      className={clsx(
        'card-body',
        className && className,
        {
          'card-scroll': scroll,
        },
        height && `h-${height}px`
      )}
    >
      {children}
    </div>
  )
})

export type KTCardFooterProps = {
  className?: string
}

const Footer: FC<PropsWithChildren<KTCardFooterProps>> = (props) => {
  const { className, children } = props
  return <div className={clsx('card-footer', className && className)}>{children}</div>
}

export type KTCardHeaderProps = {
  className?: string
}

const Header: FC<PropsWithChildren<KTCardHeaderProps>> = ({ children, className }) => {
  return <div className={clsx('card-header', className)}>{children}</div>
}

type KTCardTitleProps = {}

const Title: FC<PropsWithChildren<KTCardTitleProps>> = ({ children }) => {
  return <h3 className="card-title">{children}</h3>
}

export type KTCardToolbarProps = {
  className?: string
}

const Toolbar: FC<PropsWithChildren<KTCardToolbarProps>> = ({ children, className }) => {
  return <div className={clsx('card-toolbar', className)}>{children}</div>
}

const KTCard = Object.assign(Card, {
  Header,
  Title,
  Toolbar,
  Body,
  Footer,
})

export default KTCard
