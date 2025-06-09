import { ComponentType, Ref, useImperativeHandle, useMemo, useState } from 'react'
import { ModalProps } from 'react-bootstrap/Modal'

export type ModalControlRef<P = unknown> = {
  showModal: (props?: Exclude<P, keyof ModalProps>) => void
  hideModal: () => void
}

export type ControlledModalProps<T extends ModalProps> = T & {
  controlRef: Ref<ModalControlRef<T>>
}

export const withModalControlRef = <T extends ModalProps>(
  ModalComponent: ComponentType<T>
): ComponentType<ControlledModalProps<T>> => {
  return ({ controlRef, ...props }) => {
    const [show, setShow] = useState(false)
    const [extra, setExtra] = useState<Exclude<T, keyof ModalProps>>()

    const showModal = (extraProps?: Exclude<T, keyof ModalProps>) => {
      if (extraProps) {
        setExtra(extra)
      }

      setShow(true)
    }
    const hideModal = () => setShow(false)

    useImperativeHandle(controlRef, () => ({
      showModal,
      hideModal,
    }))

    const mergedProps = useMemo(
      () =>
        ({
          ...props,
          ...extra,
        } as unknown as T),
      [extra, props]
    )

    return (
      <ModalComponent
        {...mergedProps}
        show={show}
      />
    )
  }
}
