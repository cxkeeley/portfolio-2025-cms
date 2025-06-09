import { FC, useRef } from 'react'

type Props = {
  code: string
}

const CodeView: FC<Props> = ({ code }) => {
  const copyElement = useRef<HTMLSpanElement>(null)

  return (
    <div className="code-view border border-dashed border-gray-500">
      <span
        className="code-view__code flex-equal"
        ref={copyElement}
      >
        {code}
      </span>
    </div>
  )
}

export { CodeView }
