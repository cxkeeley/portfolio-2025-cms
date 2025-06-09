import { FC } from 'react'

type Props = {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const LanguageTabDeleteButton: FC<Props> = ({ onClick }) => {
  return (
    <div
      className="btn btn-danger text-white w-20px h-20px p-0 d-flex align-items-center justify-content-center"
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
    >
      <span className="fa-solid fa-trash fs-8"/>
    </div>
  )
}

export default LanguageTabDeleteButton
