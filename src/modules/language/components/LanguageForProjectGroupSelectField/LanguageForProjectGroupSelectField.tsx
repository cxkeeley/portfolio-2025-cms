import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import AdminLanguageAPI from '@api/admin/languagesAPI'

import { initialQueryState } from '@models/apiBase'
import { ID } from '@models/base'
import { Option } from '@models/option'

import {
  AsyncPaginateSelectField,
  AsyncPaginateSelectFieldProps,
} from '@components/Form/AsyncPaginateSelect/AsyncPaginateSelectField'

import TypeUtil from '@/utils/typeUtil'

type Props = Omit<AsyncPaginateSelectFieldProps<false>, 'onSearch'> & {
  projectGroupId: ID
}

const LanguageForProjectGroupLanguageSelectField: FC<Props> = ({ projectGroupId, ...props }) => {
  const searchDebounce = async (inputVal: string, page: number) => {
    const response = await AdminLanguageAPI.getOptionsForProjectGroupLanguageForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(inputVal) ? inputVal : undefined,
      project_group_id: projectGroupId,
    })

    if (response.data.data) {
      return {
        ...response.data.data,
        nodes: response.data.data.nodes.map(
          (lang) =>
            new Option({
              label: lang.name,
              value: lang.id,
            })
        ),
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
            model: <FormattedMessage id="model.language" />,
          }}
        />
      )}
    />
  )
}

export default LanguageForProjectGroupLanguageSelectField
