import React, { ComponentType, useContext } from 'react'

export type MapContextToProps<T, R extends {}> = (ctx: T) => Partial<R>

export const withContext = <T, R extends {}>(ctx: React.Context<T>, MapFn: MapContextToProps<T, R>) => {
  return (Component: ComponentType<Omit<R, keyof ReturnType<typeof MapFn>>>) => {
    return (props: Omit<R, keyof ReturnType<typeof MapFn>>) => {
      const mappedProps = MapFn(useContext(ctx))

      return (
        <Component
          {...mappedProps}
          {...props}
        />
      )
    }
  }
}
