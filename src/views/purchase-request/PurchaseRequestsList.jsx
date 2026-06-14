import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Breadcrumbs,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getPRList } from '../../store/slices/purchaseRequestSlice';

export default function PurchaseRequestsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, totalCount, listLoading } = useSelector((s) => s.purchaseRequest);

  const [filters, setFilters] = useState({ DocEntry: '', MRNo: '', ProjectCode: '', ProjectName: '', DocDate: '' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    dispatch(getPRList({
      top:  paginationModel.pageSize,
      skip: paginationModel.page * paginationModel.pageSize
    }));
  }, [paginationModel, dispatch]);

  const clearFilters = () => setFilters({ DocEntry: '', MRNo: '', ProjectCode: '', ProjectName: '', DocDate: '' });

  const columns = [
    { field: 'DocEntry',   headerName: 'Doc Entry',    flex: 1,   minWidth: 120 },
    { field: 'U_MRNo',     headerName: 'MR No',        flex: 1,   minWidth: 120 },
    { field: 'U_PrjCode',  headerName: 'Project Code', flex: 1,   minWidth: 150 },
    { field: 'U_PrjDesc',  headerName: 'Project Name', flex: 1.5, minWidth: 200 },
    { field: 'DocDate',    headerName: 'Posting Date', flex: 1,   minWidth: 140,
      valueFormatter: (value) => value ? value.substring(0, 10) : '' },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 80,
      renderCell: (params) => (
        <Stack direction="row" height="100%" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/purchase-requests/view/${params.row.DocEntry}`)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 176px)' }}>
      {/* Header */}
      <MainCard content={false} sx={{ mb: 3, flexShrink: 0 }}>
        <Box
          sx={{
            px: 3, py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h3">Purchase Request</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Purchase Request</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>List</Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            label="Doc Entry"
            value={filters.DocEntry}
            onChange={(e) => setFilters((p) => ({ ...p, DocEntry: e.target.value }))}
          />
          <TextField
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
          <TextField
            size="small"
            type="date"
            label="Posting Date"
            value={filters.DocDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setFilters((p) => ({ ...p, DocDate: e.target.value }))}
          />
          <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearFilters}>
            Clear
          </Button>
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={list}
          columns={columns}
          getRowId={(row) => row.DocEntry}
          loading={listLoading}
          paginationMode="server"
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            height: '100%',
            '& .MuiDataGrid-columnHeaders': {
              background: 'linear-gradient(135deg,#ede7f6,#d1c4e9)',
              color: '#4527a0',
              fontWeight: 700,
              borderBottom: '1px solid grey'
            },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f3e5f5' },
            '& .MuiDataGrid-cell': { borderColor: '#f1f1f1' },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              overflow: 'hidden'
            },
            '& .MuiDataGrid-scrollbarFiller': { display: 'none' }
          }}
        />
      </Paper>
    </Box>
  );
}
