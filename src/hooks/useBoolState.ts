import { useState } from 'react'

type SetTrueFN = () => void
type SetFalseFN = () => void
type ToggleFN = () => void
type UseToggleHook = (inititalState?: boolean) => [boolean, ToggleFN, SetTrueFN, SetFalseFN]

const useBoolState: UseToggleHook = (inititalState = false) => {
  const [state, setState] = useState<boolean>(inititalState)

  const toggle = () => setState((prev) => !prev)
  const toggleTrue = () => setState(true)
  const toggleFalse = () => setState(false)

  return [state, toggle, toggleTrue, toggleFalse]
}

export { useBoolState }
