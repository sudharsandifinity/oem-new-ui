import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Breadcrumbs, Button, Chip, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';

import MainCard from 'ui-component/cards/MainCard';
import { getPendingDeliveryReport } from '../../../store/slices/materialRequestSlice';
import { formatDateDDMMYYYY } from 'utils/dataGridFormatters';

const STATUS_META = {
  'PR Pending': { color: 'warning' },
  'PO Pending': { color: 'warning' },
  'Delivery Pending': { color: 'info' },
  'Partially Delivered': { color: 'secondary' },
  Completed: { color: 'success' }
};

const renderStatusCell = (params) => {
  const meta = STATUS_META[params.value] || { color: 'default' };
  return <Chip size="small" label={params.value || '—'} color={meta.color} variant="outlined" />;
};

const dash = (params) => (params.value == null || params.value === '' ? '—' : params.value);

export default function PendingDeliveryReport() {
  const dispatch = useDispatch();
  const { pendingDelivery, pendingDeliveryLoading } = useSelector((s) => s.materialRequest);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [loadError, setLoadError] = useState(null);

  const loadReport = async () => {
    setLoadError(null);
    try {
      await dispatch(getPendingDeliveryReport()).unwrap();
    } catch (err) {
      setLoadError(err || 'Failed to load pending delivery report');
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const rows = (Array.isArray(pendingDelivery) ? pendingDelivery : []).filter((r) => r && r.mrDocEntry != null);

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => rows.findIndex((r) => r.mrDocEntry === params.id) + 1
    },
    { field: 'mrDocEntry', headerName: 'MR', width: 110, renderCell: dash },
    { field: 'prDocEntry', headerName: 'PR', width: 110, renderCell: dash },
    { field: 'poDocEntry', headerName: 'PO', width: 110, renderCell: dash },
    { field: 'grpoDocEntry', headerName: 'GRPO', width: 150, renderCell: dash },
    {
      field: 'project',
      headerName: 'Project',
      flex: 1.3,
      minWidth: 200,
      sortable: false,
      valueGetter: (value, row) => [row.projectCode, row.projectName].filter(Boolean).join(' - ') || '—'
    },
    { field: 'requiredDate', headerName: 'Required Date', flex: 1, minWidth: 140, valueFormatter: formatDateDDMMYYYY },
    { field: 'supplierName', headerName: 'Supplier', flex: 1.3, minWidth: 180, renderCell: dash },
    { field: 'status', headerName: 'Status', width: 160, sortable: false, renderCell: renderStatusCell }
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
          <Typography variant="h4">Delivery Report</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Reports</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Delivery
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {loadError && (
        <Alert
          severity="error"
          sx={{ mb: 2, flexShrink: 0 }}
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon fontSize="small" />} onClick={loadReport}>
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.mrDocEntry}
          loading={pendingDeliveryLoading}
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
