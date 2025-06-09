import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import dayjs from '@/libs/dayjs'

import ApplicationClock from './ApplicationClock'

const makeSut = () => {
  return render(<ApplicationClock />)
}

describe('<ApplicationClock />', () => {
  const expectedFormat = 'DD MMM YYYY HH:mm:ss'

  it('Should show current time', () => {
    const currentDateTime = dayjs().format(expectedFormat)

    const { getByText } = makeSut()

    expect(getByText(currentDateTime)).toBeInTheDocument()
  })

  it('Should show current time +10 second ahead', () => {
    jest.useFakeTimers()

    const current = dayjs()

    const { getByText } = makeSut()

    expect(getByText(current.format(expectedFormat))).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(10000) // add 10 seconds
    })

    expect(getByText(current.add(10, 'second').format(expectedFormat))).toBeInTheDocument()
  })
})
