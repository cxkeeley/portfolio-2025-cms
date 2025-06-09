import { ColumnDef } from '@tanstack/react-table'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableColumnsFN<Model extends Object, Props = never> = (props: Props) => ReadonlyArray<ColumnDef<Model, any>>

export type { TableColumnsFN }
