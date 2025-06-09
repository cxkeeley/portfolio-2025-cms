import { FC } from 'react'

import { Avatar } from '@components/Avatar'

type Props = {
  imageSrc: string
  name: string
  degree: string | null
}

const DoctorNameCell: FC<Props> = ({ imageSrc, name, degree }) => {
  return (
    <div className="d-flex align-items-center gap-5">
      <Avatar
        shape="circle"
        xs="60px"
        image={imageSrc}
      />
      <div>
        <div className="fs-4 fw-medium">{name}</div>
        {degree && <div className="fw-normal">{degree}</div>}
      </div>
    </div>
  )
}

export default DoctorNameCell
