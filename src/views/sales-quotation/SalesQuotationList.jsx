import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getSalesQuotations } from '../../store/slices/salesQuotationSlice';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const emptyFilters = () => ({ DocEntry: '', CardCode: '', CardName: '', U_PrjCode: '', U_PrjDesc: '' });

export default function SalesQuotationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quotationlist, totalCount, listLoading } = useSelector((s) => s.salesQuotation);

  const [filters, setFilters] = useState(emptyFilters());
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  useEffect(() => {
    dispatch(
      getSalesQuotations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
      })
    );
  }, [pagination]);

  const filteredRows = useMemo(() => {
    const { DocEntry, CardCode, CardName, U_PrjCode, U_PrjDesc } = filters;
    return quotationlist.filter((r) => {
      if (
        DocEntry &&
        !String(r.DocEntry ?? '')
          .toLowerCase()
          .includes(DocEntry.toLowerCase())
      )
        return false;
      if (
        CardCode &&
        !String(r.CardCode ?? '')
          .toLowerCase()
          .includes(CardCode.toLowerCase())
      )
        return false;
      if (
        CardName &&
        !String(r.CardName ?? '')
          .toLowerCase()
          .includes(CardName.toLowerCase())
      )
        return false;
      if (
        U_PrjCode &&
        !String(r.U_PrjCode ?? '')
          .toLowerCase()
          .includes(U_PrjCode.toLowerCase())
      )
        return false;
      if (
        U_PrjDesc &&
        !String(r.U_PrjDesc ?? '')
          .toLowerCase()
          .includes(U_PrjDesc.toLowerCase())
      )
        return false;
      return true;
    });
  }, [quotationlist, filters]);

  const clearFilters = () => setFilters(emptyFilters());

  const columns = useMemo(
    () => [
      {
        id: 'slNo',
        header: 'Sl No',
        size: 80,
        Cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'DocEntry',
        header: 'Doc Entry',
        size: 120
      },
      {
        accessorKey: 'CardCode',
        header: 'Customer Code',
        size: 150
      },
      {
        accessorKey: 'CardName',
        header: 'Customer Name',
        size: 220
      },
      {
        accessorKey: 'DocDate',
        header: 'Posting Date',
        size: 140,
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || ''
      },
      {
        id: 'action',
        header: 'Action',
        size: 100,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" color="primary" onClick={() => navigate(`/Sales-Quotation/view/${row.original.DocEntry}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" color="secondary" onClick={() => navigate(`/Sales-Quotation/edit/${row.original.DocEntry}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
        )
      }
    ],
    [navigate]
  );

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 176px)' }}>
      <MainCard content={false} sx={{ mb: 3, flexShrink: 0 }}>
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h4">Sales Quotation</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Sales Quotation</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              List
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Box></Box>
          {/* <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <TextField
              size="small"
              label="Doc Entry"
              value={filters.DocEntry}
              onChange={(e) => setFilters((p) => ({ ...p, DocEntry: e.target.value }))}
            />
            <TextField
              size="small"
              label="Customer Code"
              value={filters.CardCode}
              onChange={(e) => setFilters((p) => ({ ...p, CardCode: e.target.value }))}
            />
            <TextField
              size="small"
              label="Customer Name"
              value={filters.CardName}
              onChange={(e) => setFilters((p) => ({ ...p, CardName: e.target.value }))}
            />

            <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearFilters}>
              Clear
            </Button>
          </Box> */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/Sales-Quotation/create')}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Create
          </Button>
        </Box>
      </Paper>

      <Paper
        // variant="outlined"
        // sx={{
        //   height: '100%',
        //   display: 'flex',
        //   flexDirection: 'column'
        // }}
      >
        <MaterialReactTable
          columns={columns}
          data={filteredRows}
          enableColumnResizing
          layoutMode="grid"
          defaultColumn={{
            minSize: 80,
            size: 150,
            maxSize: 500
          }}
          initialState={{
            pagination: {
              pageIndex: 0,
              pageSize: 8
            }
          }}
          muiTableHeadCellProps={{
            sx: {
              fontWeight: 'bold',
              color: '#4527a0',
              background: 'linear-gradient(135deg,#ede7f6,#d1c4e9)',
              borderBottom: '1px solid #bdbdbd',
              borderRight: '1px solid #d0d0d0', // Vertical separator
              '&:last-child': {
                borderRight: 'none'
              }
            }
          }}
          muiTableBodyCellProps={{
            sx: {
              borderBottom: '1px solid #e0e0e0',
              borderRight: '1px solid #e0e0e0', // Vertical separator
              '&:last-child': {
                borderRight: 'none'
              }
            }
          }}
          muiTableBodyRowProps={{
            sx: {
              '&:hover': {
                backgroundColor: '#f3e5f5'
              }
            }
          }}
          muiTableProps={{
            sx: {
              border: '1px solid #d0d0d0',
              '& th, & td': {
                borderRight: '1px solid #e0e0e0'
              },
              '& th:last-child, & td:last-child': {
                borderRight: 'none'
              }
            }
          }}
          muiBottomToolbarProps={{
            sx: {
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa'
            }
          }}
        />
      </Paper>
    </Box>
  );
}
