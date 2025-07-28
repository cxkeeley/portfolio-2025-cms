import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import AdminProjectLabelsAPI from '@api/admin/projectLabelsAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import {
  AsyncPaginateSelectField,
  AsyncPaginateSelectFieldProps,
} from '@components/Form/AsyncPaginateSelect/AsyncPaginateSelectField'

import TypeUtil from '@/utils/typeUtil'

type Props = Omit<AsyncPaginateSelectFieldProps<false>, 'onSearch'> & {}

const ProjectLabelForProjectFormSelectField: FC<Props> = (props) => {
  const searchDebounce = async (inputVal: string, page: number) => {
    const response = await AdminProjectLabelsAPI.getOptionsForProjectForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(inputVal) ? inputVal : null,
    }).then((r) => r.data)

    if (response.data) {
      return {
        ...response.data,
        nodes: response.data.nodes.map((label) => Option.fromObject(label, 'id', 'default_name')),
      }
    }
  }

  return (
    <AsyncPaginateSelectField
      {...props}
      onSearch={searchDebounce}
      noOptionsMessage={() => (
        <FormattedMessage
          id="model.not_found"
          values={{
            model: <FormattedMessage id="model.project_label" />,
          }}
        />
      )}
    />
  )
}

export default ProjectLabelForProjectFormSelectField
