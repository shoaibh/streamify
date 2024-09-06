import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Skeleton from "../ui/Skeleton";

type Props<T> = {
  inputPlaceholder: string;
  columns: ColumnDef<T>[];
  data: T[];
  totalDesc: string;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalDataCount: number;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setSearchStr: React.Dispatch<React.SetStateAction<string | undefined>>;
  searchStr: string | undefined;
  artistId: string | null;
  isLoading: boolean;
};

export function CustomTable<T>({
  inputPlaceholder,
  columns,
  data,
  totalDesc,
  pagination,
  setPagination,
  totalDataCount,
  sorting,
  setSorting,
  setSearchStr,
  searchStr,
  artistId,
  isLoading,
}: Props<T>) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    manualPagination: true,
    rowCount: totalDataCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    initialState: {
      pagination,
    },
    // globalFilterFn: ()=>"customFilter",
  });

  return (
    <div className={`w-full ${artistId ? "md:w-[calc(75vw-5rem)]" : ""} lg:w-full`}>
      <div className="flex justify-between gap-10 items-center py-4">
        <Input
          placeholder={inputPlaceholder}
          // value={(table.getColumn(inputFiler)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
            setSearchStr(event.target.value);
            // table.getColumn(inputFiler)?.setFilterValue(event.target.value);
            // table.getColumn(inputFiler2)?.setFilterValue(event.target.value);
          }}
          value={searchStr}
          className="max-w-sm w-full p-3"
          type="search"
        />
        {isLoading && <Skeleton className="h-4 w-[80%]" />}
        {!isLoading && data?.length > 0 && (
          <div className=" text-sm text-muted-foreground">
            Total {totalDataCount} Streams {totalDesc}
          </div>
        )}
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
            {isLoading &&
              // Render 5 rows as loading placeholders
              [...Array(5)].map((_, index) => (
                <tr key={index} className="border-b transition-colors">
                  {[...Array(6)].map((_, index) => {
                    return (
                      <td key={index} className="p-4 align-middle">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            {!isLoading &&
              (table.getRowModel().rows?.length ? (
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
              ))}
          </TableBody>
        </Table>
      </div>

      {isLoading && <Skeleton className="mt-5 pb-10 mx-auto w-[200px]" />}
      {!isLoading && data?.length > 0 && (
        <Pagination className="mt-5 pb-5">
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
              { length: data.length > 3 ? 3 : data.length },
              (_, index) => table.getState().pagination.pageIndex + index + (table.getState().pagination.pageIndex > 0 ? 0 : 1)
            ).map((page) => (
              <PaginationItem className="cursor-pointer" key={page}>
                <PaginationLink
                  isActive={page === table.getState().pagination.pageIndex + 1}
                  onClick={() => {
                    table.setPageIndex(page - 1);
                  }}
                >
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
      )}
    </div>
  );
}
