import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props<T> = {
  inputPlaceholder: string;
  inputFiler: string;
  inputFiler2: string;
  columns: ColumnDef<T>[];
  data: T[];
  totalDesc: string;
};

export function CustomTable<T>({ inputPlaceholder, inputFiler, inputFiler2, columns, data, totalDesc }: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const customFilter = (row, _, filterValue) => {
    // Return true if the value is found in either of the columns
    return [inputFiler, inputFiler2].some((columnId) => {
      const cellValue = row.getValue(columnId);
      return cellValue && cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    filterFns: {
      customFilter,
    },
    globalFilterFn: "customFilter",
  });

  console.log({ columnFilters });

  return (
    <div className="w-full">
      <div className="md:flex justify-between items-center py-4">
        <Input
          placeholder={inputPlaceholder}
          // value={(table.getColumn(inputFiler)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
            // table.getColumn(inputFiler)?.setFilterValue(event.target.value);
            // table.getColumn(inputFiler2)?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <div className="mt-4 md:mt-2 text-sm text-muted-foreground">
          Total {table.getFilteredRowModel().rows.length} Streams {totalDesc}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-center" key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-5">
        <PaginationContent>
          {table.getCanPreviousPage() && (
            <PaginationItem>
              <PaginationPrevious className="cursor-pointer" onClick={() => table.previousPage()} />
            </PaginationItem>
          )}
          {table.getState().pagination.pageIndex > 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {Array.from(
            { length: 3 },
            (_, index) => table.getState().pagination.pageIndex + index + (table.getState().pagination.pageIndex > 0 ? 0 : 1)
          ).map((page) => (
            <PaginationItem className="cursor-pointer" key={page}>
              <PaginationLink isActive={page === table.getState().pagination.pageIndex + 1} onClick={() => table.setPageIndex(page - 1)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {table.getPageCount() - table.getState().pagination.pageIndex > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {table.getCanNextPage() && (
            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={() => table.nextPage()} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
