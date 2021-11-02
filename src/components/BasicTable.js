import React from 'react';
import { useTable, useFilters, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table';
import styles from './BasicTable.module.scss';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, modalOpen }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);

  // if modal opens up we'll clear the filter for adding new devices
  if (modalOpen && value) {
    setValue('');
  }
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className={styles.filter}>
      <FormControl sx={{ m: 1, width: 300 }} style={{ marginLeft: '0px' }}>
        <InputLabel id="filter-label">
          <FilterAltOutlined className={styles.icon} /> Filter by Type
        </InputLabel>
        <Select
          labelId="filter-label"
          id="filter-select"
          variant="standard"
          value={value || ''}
          label="Type"
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="WINDOWS_WORKSTATION">Windows Workstation</MenuItem>
          <MenuItem value="WINDOWS_SERVER">Windows Server</MenuItem>
          <MenuItem value="Mac">MAC</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default function BasicTable({ columns, data, handleDelete, handleEdit, modalOpen }) {
  //const [filterInput, setFilterInput] = useState("");
  // Use the useTable Hook to send the columns and data to build the table
  console.log('modal open basic', modalOpen);
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    state,
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useFilters,
    useSortBy
  );

  return (
    <div className={styles.tableWapper}>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        modalOpen={modalOpen}
      />
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''
                  }
                >
                  {column.render('Header')}
                </th>
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
                    <td {...cell.getCellProps()}>
                      <span>{cell.render('Cell')}</span>
                    </td>
                  );
                })}
                <td>
                  <IconButton aria-label="edit" onClick={() => handleEdit(row.original)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(row.original.id)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
