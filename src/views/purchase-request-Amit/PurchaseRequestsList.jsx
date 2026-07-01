import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';

import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { getMyPRList, getPRList } from '../../store/slices/purchaseRequestSlice';
import { formatDateDDMMYYYY, renderNoWrapCell } from 'utils/dataGridFormatters';
import { MaterialReactTable } from 'material-react-table';

const emptyFilters = () => ({ Requester: '', ReqType: '', ProjectCode: '', ProjectName: '' });

export default function PurchaseRequestsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, totalCount, listLoading } = useSelector((s) => s.purchaseRequest);
  const { user } = useSelector((s) => s.auth);

   const [filters, setFilters] =
    useState({
      Requester: '',
      ReqType: ''
    });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

 
  useEffect(() => {
    dispatch(
      getPRList({
        top: paginationModel.pageSize,
        skip: paginationModel.page * paginationModel.pageSize,
        email: user?.email || ''
      })
    );
  }, [paginationModel, user?.email, dispatch]);

  const filteredRows = useMemo(() => {
     return (list || []).filter((r) => {
      return (
        (!filters.Requester ||
          r.Requester
            .toLowerCase()
            .includes(
              filters.Requester.toLowerCase()
            )) &&
        (!filters.ReqType ||
          r.ReqType
            .toLowerCase()
            .includes(
              filters.ReqType.toLowerCase()
            ))
      );
    });
  }, [list, filters]);

  const clearFilters = () => setFilters(emptyFilters());

  const columns = [
    {
        id: 'slNo',
        header: 'Sl No',
        size: 80,
        Cell: ({ row }) => row.index + 1
      },
      {
      accessorKey: 'DocEntry',
      header: 'Document Entry',
      flex: 1,
      minWidth: 150
    },
      {
      accessorKey: 'Requester',
      header: 'Requester',
      flex: 1,
      minWidth: 150
    },
      {
  accessorKey: 'DocDate',
  header: 'Posting Date',
  size: 140,
  Cell: ({ cell }) => formatDateDDMMYYYY(cell.getValue()),
},
   {
  accessorKey: 'Comments',
  header: 'Comments',
  size: 180,
  Cell: ({ cell }) => (
    <Typography
      noWrap
      title={cell.getValue() ?? ''}
      sx={{ width: '100%' }}
    >
      {cell.getValue()}
    </Typography>
  ),
},
    {
      accessorKey: 'action',
      header: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 80,
      Cell: ({ row }) => (
        <Stack direction="row" height="100%" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => navigate(`/purchase-request/view/${row.original.DocEntry}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="primary" onClick={() => navigate(`/purchase-request/edit/${row.original.DocEntry}`)}>
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
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h4">Purchase Request</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Purchase Request</Typography>
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
            label="MR No"
            value={filters.MRNo}
            onChange={(e) => setFilters((p) => ({ ...p, MRNo: e.target.value }))}
          />
          <TextField
            size="small"
            label="Project Code"
            value={filters.ProjectCode}
            onChange={(e) => setFilters((p) => ({ ...p, ProjectCode: e.target.value }))}
          />
          <TextField
            size="small"
            label="Project Name"
            value={filters.ProjectName}
            onChange={(e) => setFilters((p) => ({ ...p, ProjectName: e.target.value }))}
          />
          <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearFilters}>
            Clear
          </Button> */}
        </Box>
         <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/purchase-request/create')}
            sx={{
              minWidth: 140,
              whiteSpace: 'nowrap'
            }}
          >
            Create
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <MaterialReactTable
           data={(filteredRows || []).map((row) => ({
            ...row,
            id: row.DocEntry
          }))}
          columns={columns}
           enableColumnResizing={true}
          layoutMode={'grid'}
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
          loading={listLoading}
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
