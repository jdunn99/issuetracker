/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useTable, useFilters, useRowSelect } from "react-table";
import { Button, Checkbox, Flex } from "@chakra-ui/react";

interface TableProps {
  columns: any;
  data: any;
  callback?: (tableData: any) => void;
}

/** From react-table docs */
const IndeterminateCheckbox = React.forwardRef((props, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    (resolvedRef as any).current.indeterminate = (props as any).indeterminate;
  }, [resolvedRef, props]);

  return (
    <React.Fragment>
      <Checkbox colorScheme="purple" ref={resolvedRef as any} {...props} />
    </React.Fragment>
  );
});

export const CheckedTable: React.FC<TableProps> = ({
  columns,
  callback,
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox

          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...(row as any).getToggleRowSelectedProps()}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  ) as any;

  return (
    <React.Fragment>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      data-label={cell.column.Header}
                      {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Flex align="center" justify="space-between">
        <p>
          {Object.keys(selectedRowIds).length > 0
            ? `${Object.keys(selectedRowIds).length} users selected.`
            : ""}
        </p>
        <Button
          size="sm"
          disabled={Object.keys(selectedRowIds).length === 0}
          onClick={() => {
            if (callback) callback(selectedFlatRows.map((row) => row.original));
          }}>
          Remove Users
        </Button>
      </Flex>
    </React.Fragment>
  );
};

export const Table: React.FC<TableProps> = ({ columns, data, callback }) => {
  const tableInstance = useTable<any>({ columns, data }, useFilters);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    // apply the table props

    <table {...getTableProps()}>
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th
                    style={{ textAlign: "left" }}
                    {...column.getHeaderProps()}>
                    {
                      // Render the header

                      column.render("Header")
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr
                onClick={() => {
                  if (!!callback) callback(row.original);
                }}
                style={{ cursor: "pointer", width: "100%" }}
                {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td
                        data-label={cell.column.Header}
                        {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};
