import { BaseModel } from './base'

enum LanguageCodeEnum {
  ID = 'id',
  EN = 'en',
}

type LanguageModel = BaseModel & {
  code: LanguageCodeEnum
  name: string
}

export { LanguageCodeEnum }

export default LanguageModel
