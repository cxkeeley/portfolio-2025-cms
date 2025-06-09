import clsx from 'clsx'
import { FC, PropsWithChildren } from 'react'

type ContainerProps = {}

type LabelProps = {
  isRequired?: boolean
}

type GroupProps = {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outlined'
}

type HelperTextProps = {}

type GroupTextProps = {}

type ErrorMessageProps = {
  message: string | undefined
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({ children }) => {
  return <div>{children}</div>
}

const Group: FC<PropsWithChildren<GroupProps>> = ({ children, size, variant }) => {
  return (
    <div
      className={clsx('input-group ', {
        'input-group-solid': variant === 'solid',
        [`input-group-${size}`]: !!size,
      })}
    >
      {children}
    </div>
  )
}

const GroupText: FC<PropsWithChildren<GroupTextProps>> = ({ children }) => {
  return <div className="input-group-text">{children}</div>
}

const HelperText: FC<PropsWithChildren<HelperTextProps>> = ({ children }) => {
  return <div className="form-text">{children}</div>
}

const Label: FC<PropsWithChildren<LabelProps>> = ({ isRequired, children }) => {
  return <div className={clsx('form-label', { required: isRequired })}>{children}</div>
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  if (message) {
    return <div className="invalid-feedback d-block">{message}</div>
  }
  return null
}

const FormControl = Object.assign(Container, {
  Group,
  GroupText,
  Label,
  HelperText,
  ErrorMessage,
})

export default FormControl
