const availableLanguages = ['en', 'id'] as const

export type Language = (typeof availableLanguages)[number]
