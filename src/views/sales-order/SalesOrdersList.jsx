import { useMemo, useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { Box, Breadcrumbs, Button, Chip, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';

// mui x
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'react-redux';
import { getSalesOrders } from 'store/slices/salesOrderSlice';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';

export default function SalesOrderList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSalesOrders());
  }, []);

  const { loading, error, orders } = useSelector((state) => state.salesOrder);

  const [filters, setFilters] = useState({
    CardCode: '',
    CardName: ''
  });

  const handleChange = (accessorKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [accessorKey]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      CardCode: '',
      CardName: ''
    });
  };

  const filteredRows = useMemo(() => {
    return (orders || []).filter((r) => {
      return (
        (!filters.CardCode || r.CardCode.toLowerCase().includes(filters.CardCode.toLowerCase())) &&
        (!filters.CardName || r.CardName.toLowerCase().includes(filters.CardName.toLowerCase()))
      );
    });
  }, [orders, filters]);

  const columns = [
    {
      id: 'slNo',
      header: 'Sl No',
      size: 80,
      Cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'CardCode',
      header: 'Customer Code',
      flex: 1,
      minWidth: 150
    },
    {
      accessorKey: 'CardName',
      header: 'Customer Name',
      flex: 1.5,
      minWidth: 220
    },
    {
      accessorKey: 'projectCode',
      header: 'Project Code',
      flex: 1,
      minWidth: 150
    },
    {
      accessorKey: 'DocDate',
      header: 'Posting Date',
      flex: 1,
      minWidth: 150
    },
    {
      accessorKey: 'DocumentStatus',
      header: 'Status',
      flex: 1,
      minWidth: 120,
      Cell: ({ row }) => {
        console.log('params', row);
        const isOpen = row.original.DocumentStatus === 'bost_Open';
        return <Chip label={isOpen ? 'Open' : 'Closed'} size="small" color={isOpen ? 'success' : 'default'} />;
      }
    },
    {
      accessorKey: 'action',
      header: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 130,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => navigate(`/sales-order/view/${ row.original.DocEntry}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" color="secondary" onClick={() => navigate(`/sales-order/edit/${ row.original.DocEntry}`)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MainCard content={false} sx={{ mb: 3, flexShrink: 0 }}>
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              md: 'center'
            },
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            gap: 2
          }}
        >
          <Typography variant="h3" sx={{ color: 'theme.vars.palette.grey[100]' }}>
            Sales Orders
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <HomeIcon
                sx={{
                  fontSize: 18,
                  color: 'secondary.main'
                }}
              />
            </Box>

            <Typography variant="body2">Sales Orders</Typography>

            <Typography variant="body2" color="secondary" fontWeight={600}>
              List
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          flexShrink: 0
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              md: 'center'
            },
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              flex: 1
            }}
          >
            {/* <TextField
              size="small"
              label="Customer Code"
              value={filters.CardCode}
              onChange={(e) => handleChange('CardCode', e.target.value)}
            />

            <TextField
              size="small"
              label="Customer Name"
              value={filters.CardName}
              onChange={(e) => handleChange('CardName', e.target.value)}
            />

            <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearFilters}>
              Clear
            </Button> */}
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/sales-order/create')}
            sx={{
              minWidth: 140,
              whiteSpace: 'nowrap'
            }}
          >
            Create
          </Button>
        </Box>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
          {error}
        </Alert>
      )}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <MaterialReactTable
          data={(filteredRows || []).map((row) => ({
            ...row,
            id: row.DocEntry
          }))}
          columns={columns}
          loading={loading}
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
              // color: '#eef2f6',
              background: '#e7e7e7',
              //borderBottom: '1px solid #bdbdbd',
              //borderRight: '1px solid #d0d0d0', // Vertical separator
              '&:last-child': {
                borderRight: 'none'
              }
            }
          }}
          muiTableBodyRowProps={{ sx: { '&:hover': { backgroundColor: '#f3e5f5' } } }}
          muiTableBodyCellProps={{ sx: { borderColor: '#f1f1f1' } }}
          muiBottomToolbarProps={{ sx: { borderTop: '1px solid #e0e0e0', backgroundColor: '#fafafa' } }}
        
        />
      </Paper>
    </Box>
  );
}
