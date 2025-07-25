import { createColumnHelper } from '@tanstack/react-table'
import { FormattedMessage } from 'react-intl'

import { LocationServiceModel } from '@models/projectService'

import EmptyPlaceholderText from '@components/EmptyPlaceholderText'
import { FormatDate } from '@components/FormatDate'
import { Image } from '@components/Image'

const locationServiceColumnHelper = createColumnHelper<LocationServiceModel>()

const imageColumn = locationServiceColumnHelper.display({
  id: 'image_file',
  size: 50,
  header: () => <FormattedMessage id="vocabulary.image" />,
  cell: ({ row }) => {
    if (row.original.image_file) {
      return (
        <Image
          src={row.original.image_file.link}
          width={48}
          aspectRatio={1}
        />
      )
    } else {
      return <EmptyPlaceholderText />
    }
  },
})

const titleColumn = locationServiceColumnHelper.accessor('default_title', {
  id: 'default_title',
  header: () => <FormattedMessage id="vocabulary.title" />,
  size: 300,
  cell: (info) => info.getValue() ?? <EmptyPlaceholderText />,
})

const updatedAtColumn = locationServiceColumnHelper.accessor('updated_at', {
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

const locationServiceColumns = {
  image: imageColumn,
  title: titleColumn,
  updatedAt: updatedAtColumn,
}

export { locationServiceColumnHelper }

export default locationServiceColumns
