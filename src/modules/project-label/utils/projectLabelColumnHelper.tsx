import { createColumnHelper } from '@tanstack/react-table'
import { FormattedMessage } from 'react-intl'

import { ProjectLabelModel } from '@models/projectLabel'

import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import { FormatDate } from '@components/FormatDate'
import { Image } from '@components/Image'

const projectLabelColumnHelper = createColumnHelper<ProjectLabelModel>()

const nameColumn = projectLabelColumnHelper.accessor('default_name', {
  id: 'default_name',
  size: 300,
  header: () => <FormattedMessage id="vocabulary.name" />,
  cell: (info) => info.getValue() ?? <EmptyPlaceholderText />,
})

const updatedAtColumn = projectLabelColumnHelper.accessor('updated_at', {
  id: 'updated_at',
  size: 175,
  header: () => <FormattedMessage id="table.updated_at" />,
  cell: (info) => (
    <FormatDate
      date={info.getValue()}
      withTime
    />
  ),
})

const mapIconColumn = projectLabelColumnHelper.display({
  id: 'map_icon_file',
  header: () => <FormattedMessage id="vocabulary.icon" />,
  cell: (info) => {
    const iconFile = info.row.original.map_icon_file

    if (iconFile) {
      return (
        <Image
          src={info.row.original.map_icon_file?.link}
          width={48}
          aspectRatio={1}
        />
      )
    }

    return <EmptyPlaceholderText />
  },
})

const projectLabelColumns = {
  name: nameColumn,
  mapIcon: mapIconColumn,
  updatedAt: updatedAtColumn,
}

export { projectLabelColumnHelper }

export default projectLabelColumns
