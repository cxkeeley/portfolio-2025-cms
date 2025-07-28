import { FC } from 'react'

import { Avatar } from '@components/Avatar'

type Props = {
  name: string
  imageSrc: string
}

const ProjectGroupNameCell: FC<Props> = ({ name, imageSrc }) => {
  return (
    <div className="d-flex align-items-center gap-5">
      <Avatar
        shape="circle"
        xs="60px"
        image={imageSrc}
      />
      <div>
        <div className="fs-4 fw-bold">{name}</div>
      </div>
    </div>
  )
}

export default ProjectGroupNameCell
