import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import clsx from 'clsx'
import { ReactNode, useEffect, useMemo, useRef } from 'react'

import { SortDirectionEnum } from '@models/apiBase'

import TypeUtil from '@/utils/typeUtil'

import FloatLoadingIndicator from '../FloatLoadingIndicator'
import { TableRowEmpty } from './Row/TableRowEmpty'

type TableVariant =
  | 'bordered'
  | 'border-bottom'
  | 'row-dashed'
  | 'row-bordered'
  | 'stripped'
  | 'rounded'
  | 'flush'
  | 'hover'
  | 'active'
  | 'column-bordered'

type TableFormatProps<T extends object> = {
  variant?: TableVariant[]
  gapStart?: number
  gapX?: number
  gapY?: number
  height?: number
  className?: string
  thClassName?: string
  tbodyClassName?: string
  paginationClassName?: string
  paginationSize?: 'sm' | 'lg'
  footer?: ReactNode
  enableFixedHeader?: boolean
  onHeaderClick?: (key: keyof T) => void
  onRowClick?: (row: Row<T>) => void
}

type TableSortProps<T extends Object> = {
  sorts?: Map<keyof T, SortDirectionEnum>
}

type TableDataProps<T extends object> = {
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[]
  data: Array<T> | undefined
}

export type TableProps<T extends Object> = TableFormatProps<T> & TableDataProps<T> & TableSortProps<T>

const Table = <T extends Object = {}>({
  isLoading,
  columns,
  data,
  paginationSize,
  sorts,
  tbodyClassName,
  enableFixedHeader,
  height,
  gapY = 5,
  gapStart = 10,
  variant = ['row-bordered', 'border-bottom'],
  thClassName = 'text-start text-gray-700 bg-light fs-6',
  paginationClassName = 'my-3',
  onHeaderClick,
  onRowClick,
  ...props
}: TableProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tableVariant = variant.map((v) => `table-${v}`).join(' ')

  const memoizedData = useMemo(() => {
    return TypeUtil.isDefined(data) ? data : []
  }, [data])

  const table = useReactTable({
    columns,
    data: memoizedData,
    getCoreRowModel: getCoreRowModel(),
  })

  const rowModel = table.getRowModel()
  const allColumns = table.getAllColumns()

  useEffect(() => {
    if (enableFixedHeader && !TypeUtil.isDefined(height)) {
      if (containerRef.current && containerRef.current.parentElement) {
        containerRef.current.style.setProperty('height', `${containerRef.current.parentElement.clientHeight}px`)
      }
    }
  }, [enableFixedHeader, height])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={clsx('table-responsive position-relative', {
        'overflow-y-auto': enableFixedHeader,
      })}
    >
      <table
        className={clsx('table align-middle', tableVariant, props.className, {
          [`gx-${props.gapX}`]: TypeUtil.isDefined(props.gapX),
          [`gs-${gapStart}`]: TypeUtil.isDefined(gapStart),
          [`gy-${gapY}`]: TypeUtil.isDefined(gapY),
        })}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={thClassName}
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={clsx(tbodyClassName, 'fs-6')}>
          {rowModel.rows.length > 0 ? (
            rowModel.rows.map((row: Row<T>) => {
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  })}
                </tr>
              )
            })
          ) : (
            <TableRowEmpty colSpan={allColumns.length} />
          )}
        </tbody>
      </table>
      {isLoading && <FloatLoadingIndicator />}
    </div>
  )
}

export { Table }
