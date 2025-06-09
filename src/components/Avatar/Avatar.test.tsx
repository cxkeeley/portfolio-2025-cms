import { fireEvent, render } from '@testing-library/react'

import Avatar, { AvatarProps } from './Avatar'

const makeSut = (props: AvatarProps) => {
  return render(<Avatar {...props} />)
}

describe('<Avatar />', () => {
  it('should render with label initial ? if no image and label', () => {
    const labelClassName = 'test-class'
    const renderResult = makeSut({
      labelClassName,
    })

    const imageElement = renderResult.container.querySelector('img')
    const labelElement = renderResult.container.querySelector('div.symbol-label')

    expect(imageElement).not.toBeInTheDocument()

    expect(renderResult.getByText('?')).toBeInTheDocument()
    expect(labelElement).toBeInTheDocument()
    expect(labelElement?.classList).toContain(labelClassName)
  })

  it('should render with correct sizes', () => {
    const renderResult = makeSut({
      xs: '20px',
      sm: '25px',
      md: '30px',
      lg: '35px',
      xl: '40px',
      xxl: '50px',
    })

    expect(renderResult.container.firstChild).toHaveClass(
      'symbol',
      'symbol-20px',
      'symbol-sm-25px',
      'symbol-md-30px',
      'symbol-lg-35px',
      'symbol-xl-40px',
      'symbol-xxl-50px'
    )
  })

  it('should render with correct shapes', () => {
    const renderCircle = makeSut({
      shape: 'circle',
    })

    expect(renderCircle.container.firstChild).toHaveClass('symbol', 'symbol-circle')

    const renderSquare = makeSut({
      shape: 'square',
    })

    expect(renderSquare.container.firstChild).toHaveClass('symbol', 'symbol-square')
  })

  it('should render with image if success instead of label', () => {
    const label = 'Profile Image'
    const image = 'profile.png'

    const renderResult = makeSut({
      label,
      image,
    })
    const imageElement = renderResult.container.querySelector('img')
    const labelElement = renderResult.container.querySelector('div.symbol-label')

    expect(imageElement).toBeInTheDocument()
    expect(imageElement?.src).toContain(image)
    expect(renderResult.getByAltText(label)).toBeInTheDocument()

    expect(labelElement).not.toBeInTheDocument()
  })

  it('should render with label if image fail to load', () => {
    const label = 'Profile Image'
    const image = 'profile.png'

    const renderResult = makeSut({
      label,
      image,
    })
    const imageElement = renderResult.container.querySelector('img')
    fireEvent.error(imageElement!)

    const labelElement = renderResult.container.querySelector('div.symbol-label')

    expect(imageElement).not.toBeInTheDocument()

    expect(labelElement).toBeInTheDocument()
  })

  it('should render with first & last letter initial label', () => {
    const label = 'Doctor Specialist One'
    const initial = 'DO'

    const renderResult = makeSut({
      label,
    })

    const labelElement = renderResult.container.querySelector('div.symbol-label')

    expect(labelElement).toBeInTheDocument()
    expect(renderResult.getByText(initial, { exact: true })).toBeInTheDocument()
  })
})
