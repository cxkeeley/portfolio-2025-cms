import { render } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import enMessages from '@/i18n/en.json'

import Button, { ButtonProps, HoverEffect, Size, Theme, Variant } from './Button'

const themeData = ['secondary', 'light', 'primary', 'warning', 'success', 'danger', 'info'] as Array<Theme>
const colorData = [...themeData, 'gray-600']
const sizeData = ['lg', 'sm'] as Array<Size>
const variantData = ['icon', 'light', 'link', 'outline'] as Array<Variant>
const hoverData = ['elevate-down', 'elevate-up', 'rotate-end', 'rotate-start', 'scale'] as Array<HoverEffect>

const makeSut = (props: ButtonProps) => {
  return render(
    <IntlProvider
      locale="en"
      messages={enMessages}
    >
      <Button {...props} />
    </IntlProvider>
  )
}

describe('<Button />', () => {
  it('render with correct sizes', () => {
    sizeData.forEach((size) => {
      const renderResult = makeSut({
        size,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-${size}`)
    })
  })

  it('render with correct text colors', () => {
    colorData.forEach((color) => {
      const renderResult = makeSut({
        textColor: color,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-color-${color}`)
    })
  })

  it('render with correct active text colors', () => {
    colorData.forEach((color) => {
      const renderResult = makeSut({
        activeTextColor: color,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-active-color-${color}`)
    })
  })

  it('render with correct icon colors', () => {
    colorData.forEach((color) => {
      const renderResult = makeSut({
        iconColor: color,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-icon-${color}`)
    })
  })

  it('render with correct background colors', () => {
    colorData.forEach((color) => {
      const renderResult = makeSut({
        bg: color,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-bg-${color}`)
    })
  })

  it('render with correct hover effects', () => {
    hoverData.forEach((hover) => {
      const renderResult = makeSut({
        hover: hover,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `hover-${hover}`)
    })
  })

  it('render with correct variants', () => {
    variantData.forEach((variant) => {
      const renderResult = makeSut({
        variant: variant,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-${variant}`)
    })
  })

  it('render with correct themes', () => {
    const testData: Array<ButtonProps['theme']> = themeData as Array<ButtonProps['theme']>

    testData.forEach((data) => {
      const renderResult = makeSut({
        theme: data,
      })

      expect(renderResult.container.firstChild).toHaveClass('btn', `btn-${data}`)
    })
  })

  it('render with correct active & theme style if variant is not provided', () => {
    const testData: Array<ButtonProps> = themeData.map<ButtonProps>((theme) => ({
      theme: theme as Theme,
      activeColor: 'primary',
    }))

    testData.forEach((props) => {
      const renderResult = makeSut(props)

      expect(renderResult.container.firstChild).toHaveClass(
        'btn',
        `btn-${props.theme}`,
        `btn-active-${props.activeColor}`
      )
    })
  })

  it('render button variant light with correct theme and active style', () => {
    const testData = sizeData.flatMap((size) =>
      colorData.flatMap((color) =>
        hoverData.flatMap(
          (hover) =>
            ({
              size,
              hover,
              textColor: color,
              activeTextColor: color,
              bg: color,
              variant: 'light',
              theme: 'primary',
              activeColor: 'success',
            } as ButtonProps)
        )
      )
    )

    testData.forEach((props) => {
      const renderResult = makeSut(props)

      expect(renderResult.container.firstChild).toHaveClass(
        'btn',
        'btn-light-primary',
        'btn-active-light-success',
        `btn-${props.size}`,
        `btn-bg-${props.bg}`,
        `btn-color-${props.textColor}`,
        `btn-active-color-${props.activeTextColor}`,
        `hover-${props.hover}`
      )
      expect(renderResult.container.firstChild).not.toHaveClass(
        'btn-primary',
        'btn-light',
        'btn-outline',
        'btn-link',
        'btn-active-success'
      )
    })

    const testDataWithLightTheme = sizeData.flatMap((size) =>
      colorData.flatMap((color) =>
        hoverData.flatMap(
          (hover) =>
            ({
              size,
              hover,
              textColor: color,
              activeTextColor: color,
              bg: color,
              variant: 'light',
              theme: 'light',
              activeColor: 'success',
            } as ButtonProps)
        )
      )
    )

    testDataWithLightTheme.forEach((props) => {
      const renderResult = makeSut(props)

      expect(renderResult.container.firstChild).toHaveClass(
        'btn',
        'btn-light',
        'btn-active-light-success',
        `btn-${props.size}`,
        `btn-bg-${props.bg}`,
        `btn-color-${props.textColor}`,
        `btn-active-color-${props.activeTextColor}`,
        `hover-${props.hover}`
      )
      expect(renderResult.container.firstChild).not.toHaveClass(
        'btn-light-light',
        'btn-outline',
        'btn-link',
        'btn-active-success'
      )
    })
  })

  it('render button variant link and cannot be given theme or active styles', () => {
    const testData = sizeData.flatMap((size) =>
      colorData.flatMap((color) =>
        hoverData.flatMap(
          (hover) =>
            ({
              size,
              hover,
              textColor: color,
              activeTextColor: color,
              bg: color,
              variant: 'link',
              theme: 'primary',
              activeColor: 'success',
            } as ButtonProps)
        )
      )
    )

    testData.forEach((props) => {
      const renderResult = makeSut(props)

      expect(renderResult.container.firstChild).toHaveClass(
        'btn',
        'btn-link',
        `btn-${props.size}`,
        `btn-bg-${props.bg}`,
        `btn-color-${props.textColor}`,
        `btn-active-color-${props.activeTextColor}`,
        `hover-${props.hover}`
      )
      expect(renderResult.container.firstChild).not.toHaveClass(
        'btn-primary',
        'btn-light',
        'btn-outline',
        'btn-active-success'
      )
    })
  })

  it('render button variant outline with correct theme and active style', () => {
    const testData = sizeData.flatMap((size) =>
      colorData.flatMap((color) =>
        hoverData.flatMap(
          (hover) =>
            ({
              size,
              hover,
              textColor: color,
              activeTextColor: color,
              bg: color,
              variant: 'outline',
              theme: 'primary',
              activeColor: 'success',
            } as ButtonProps)
        )
      )
    )

    testData.forEach((props) => {
      const renderResult = makeSut(props)

      expect(renderResult.container.firstChild).toHaveClass(
        'btn',
        'btn-outline',
        'btn-outline-primary',
        'btn-active-success',
        `btn-${props.size}`,
        `btn-bg-${props.bg}`,
        `btn-color-${props.textColor}`,
        `btn-active-color-${props.activeTextColor}`,
        `hover-${props.hover}`
      )
      expect(renderResult.container.firstChild).not.toHaveClass('btn-primary', 'btn-light', 'btn-outline', 'btn-link')
    })
  })

  it('render button variant icon with correct theme and active style', () => {
    const testData = sizeData.flatMap((size) =>
      colorData.flatMap((color) =>
        hoverData.flatMap(
          (hover) =>
            ({
              size,
              hover,
              textColor: color,
              activeTextColor: color,
              bg: color,
              variant: 'icon',
              theme: 'primary',
              activeColor: 'success',
            } as ButtonProps)
        )
      )
    )

    testData.forEach((props) => {
      const renderResult = makeSut(props)

      expect(renderResult.container.firstChild).toHaveClass(
        'btn',
        'btn-icon',
        'btn-primary',
        'btn-active-success',
        `btn-${props.size}`,
        `btn-bg-${props.bg}`,
        `btn-color-${props.textColor}`,
        `btn-active-color-${props.activeTextColor}`,
        `hover-${props.hover}`
      )
      expect(renderResult.container.firstChild).not.toHaveClass('btn-light', 'btn-outline', 'btn-link')
    })
  })

  it("render button correctly if state is 'active'", () => {
    const renderResult = makeSut({
      theme: 'primary',
      activeColor: 'danger',
      disabled: true,
      isActive: true,
    })

    expect(renderResult.container.firstChild).toHaveClass('btn', 'btn-primary', 'btn-active-danger', 'active')
  })
})
