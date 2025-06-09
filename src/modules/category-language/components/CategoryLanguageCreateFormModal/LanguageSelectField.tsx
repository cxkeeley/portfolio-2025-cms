import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import AdminLanguageAPI from '@api/admin/languagesAPI'

import { initialQueryState } from '@models/apiBase'
import { ID } from '@models/base'
import LanguageModel from '@models/language'
import { Option } from '@models/option'

import {
  AsyncPaginateSelectField,
  AsyncPaginateSelectFieldProps,
} from '@components/Form/AsyncPaginateSelect/AsyncPaginateSelectField'

import TypeUtil from '@/utils/typeUtil'

type Props = Omit<AsyncPaginateSelectFieldProps<false>, 'onSearch'> & {
  categoryId: ID
}

const LanguageSelectField: FC<Props> = ({ categoryId, ...props }) => {
  const searchDebounce = async (inputVal: string, page: number) => {
    const response = await AdminLanguageAPI.getOptionsForCategoryLanguageForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(inputVal) ? inputVal : undefined,
      category_id: categoryId,
    }).then((r) => r.data)

    if (response.data) {
      return {
        ...response.data,
        nodes: response.data.nodes.map(
          (lang) =>
            new Option<LanguageModel>({
              label: lang.name,
              value: lang.id,
              data: lang,
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

export default LanguageSelectField
