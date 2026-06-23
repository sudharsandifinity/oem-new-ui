import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Breadcrumbs, Button, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getMRPendingReport } from '../../../store/slices/materialRequestSlice';
import { formatDateDDMMYYYY } from 'utils/dataGridFormatters';

export default function PendingApprovalReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pendingReport, pendingReportCount, pendingReportLoading } = useSelector((s) => s.materialRequest);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [loadError, setLoadError] = useState(null);

  const loadReport = async () => {
    setLoadError(null);
    try {
      await dispatch(getMRPendingReport({ top: paginationModel.pageSize, skip: paginationModel.page * paginationModel.pageSize })).unwrap();
    } catch (err) {
      setLoadError(err || 'Failed to load pending approval report');
    }
  };

  useEffect(() => {
    loadReport();
  }, [paginationModel]);

  const rows = (Array.isArray(pendingReport) ? pendingReport : []).filter((r) => r && r.DocEntry != null);

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => rows.findIndex((r) => r.DocEntry === params.id) + 1
    },
    {
      field: 'document',
      headerName: 'Document',
      flex: 1,
      minWidth: 170,
      sortable: false,
      valueGetter: () => 'Material Requisition'
    },
    { field: 'DocEntry', headerName: 'Document Number', width: 150 },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1.3,
      minWidth: 200,
      sortable: false,
      valueGetter: (value, row) => [row.U_CardCode, row.U_CardName].filter(Boolean).join(' - ')
    },
    {
      field: 'project',
      headerName: 'Project',
      flex: 1.3,
      minWidth: 200,
      sortable: false,
      valueGetter: (value, row) => [row.U_PrjCode, row.U_PrjDesc].filter(Boolean).join(' - ')
    },
    { field: 'U_DocDate', headerName: 'Requisition Date', flex: 1, minWidth: 150, valueFormatter: formatDateDDMMYYYY },
    {
      field: 'approvalStatus',
      headerName: 'Approval Status',
      width: 140,
      sortable: false,
      renderCell: () => <Chip size="small" label="Pending" color="warning" variant="outlined" />
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 80,
      renderCell: (params) => (
        <Stack direction="row" height="100%" spacing={0.5} alignItems="center">
          <Tooltip title="View">
            <IconButton size="small" color="primary" onClick={() => navigate(`/material-request/view/${params.row.DocEntry}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
          <Typography variant="h4">Pending Approval Document Reports</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Reports</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Pending Approvals
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
          getRowId={(row) => row.DocEntry}
          loading={pendingReportLoading}
          paginationMode="server"
          rowCount={pendingReportCount}
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
