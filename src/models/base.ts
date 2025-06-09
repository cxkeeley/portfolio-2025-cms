export type ID = string

export type BaseModel = {
  id: ID
  created_at: string
  updated_at: string
}

export enum BloodTypeEnum {
  A_PLUS = 'A+',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B_MINUM = 'B-',
  AB_PLUS = 'AB+',
  AB_MINUS = 'AB-',
  O_PLUS = 'O+',
  O_MINUS = 'O-',
}

export enum AgeUnitEnum {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatusEnum {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum MonthNameEnum {
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
}

export enum RelationTypeEnum {
  MOTHER = 'MOTHER',
  FATHER = 'FATHER',
  MOTHER_IN_LAW = 'MOTHER_IN_LAW',
  FATHER_IN_LAW = 'FATHER_IN_LAW',
  BROTHER = 'BROTHER',
  SISTER = 'SISTER',
  WIFE = 'WIFE',
  HUSBAND = 'HUSBAND',
  SON = 'SON',
  DAUGHTER = 'DAUGHTER',
  GRAND_MOTHER = 'GRAND_MOTHER',
  GRAND_FATHER = 'GRAND_FATHER',
  GRAND_SON = 'GRAND_SON',
  GRAND_DAUGHTER = 'GRAND_DAUGHTER',
  UNCLE = 'UNCLE',
  AUNT = 'AUNT',
  NEPHEW = 'NEPHEW',
  NIECE = 'NIECE',
  COUSIN = 'COUSIN',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER',
}

export enum ReligionEnum {
  ISLAM = 'ISLAM',
  KRISTEN_PROTESTAN = 'KRISTEN_PROTESTAN',
  KATOLIK = 'KATOLIK',
  HINDU = 'HINDU',
  BUDDHA = 'BUDDHA',
  KONG_HU_CU = 'KONG_HU_CU',
}
