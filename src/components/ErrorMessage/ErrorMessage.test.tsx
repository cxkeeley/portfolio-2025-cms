import { render } from '@testing-library/react'

import ErrorMessage, { ErrorMessageProps } from './ErrorMessage'

const makeSut = (props: ErrorMessageProps) => {
  return render(<ErrorMessage {...props} />)
}

describe('<ErrorMessage />', () => {
  it('Should render error message', () => {
    const message = 'Some Error Message!'

    const { getByText } = makeSut({ message })

    expect(getByText(message)).toBeInTheDocument()
  })

  it('Should not render the component', () => {
    const message = undefined

    const { container } = makeSut({ message })

    expect(container.querySelector('[data-testid="error-message"]')).not.toBeInTheDocument()
  })
})
