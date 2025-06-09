import { ReactNode, RefObject, useRef } from 'react'

type RendererProps<T extends HTMLElement> = {
  elementRef: RefObject<T>
  isRefHasValue: boolean
  executeScroll: () => void
}

type ChildrenRenderer<T extends HTMLElement> = (parameters: RendererProps<T>) => ReactNode

type Props<T extends HTMLElement> = {
  scrollViewOptions?: boolean | ScrollIntoViewOptions
  children?: ChildrenRenderer<T>
}

const ScrollIntoView = <T extends HTMLElement>({
  scrollViewOptions = {
    behavior: 'smooth',
  },
  children,
}: Props<T>) => {
  const elementRef = useRef<T>(null)
  const isRefHasValue = !!elementRef && !!elementRef.current

  const executeScroll = () => elementRef && elementRef.current && elementRef.current.scrollIntoView(scrollViewOptions)

  return (
    <>
      {(children as ChildrenRenderer<T>)({
        elementRef,
        isRefHasValue,
        executeScroll,
      })}
    </>
  )
}

export { ScrollIntoView }
