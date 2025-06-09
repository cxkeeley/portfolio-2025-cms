import { FC } from 'react'

export type ErrorMessageProps = {
  message?: string
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  if (message) {
    return (
      <div
        className="fv-plugins-message-container"
        data-testid="error-message"
      >
        <div className="fv-help-block">
          <span role="alert">{message}</span>
        </div>
      </div>
    )
  }

  return null
}

export default ErrorMessage
