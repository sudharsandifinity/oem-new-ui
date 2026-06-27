import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Breadcrumbs, Button, Chip, Paper, Snackbar, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import SyncIcon from '@mui/icons-material/Sync';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import { getCompanyProjects, syncCompanyProjects } from '../../../store/slices/commonCustomerSlice';

const renderActiveCell = (params) => {
  const active = params.value === 'tYES' || params.value === 'Y' || params.value === true;
  return <Chip size="small" label={active ? 'Active' : 'Inactive'} color={active ? 'success' : 'default'} variant="outlined" />;
};

export default function ProjectManagementList() {
  const dispatch = useDispatch();
  const { companyProjects, companyProjectsLoading, syncLoading } = useSelector((s) => s.commonCustomer);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const loadProjects = () => dispatch(getCompanyProjects());

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSync = async () => {
    try {
      const result = await dispatch(syncCompanyProjects()).unwrap();
      const inserted = result?.inserted ?? 0;
      const updated = result?.updated ?? 0;
      setSnackbar({
        open: true,
        severity: 'success',
        message: `Projects synced — ${inserted} added, ${updated} updated.`
      });
      loadProjects();
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: err || 'Failed to sync projects' });
    }
  };

  const rows = Array.isArray(companyProjects) ? companyProjects : [];

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => rows.findIndex((r) => r.id === params.id) + 1
    },
    { field: 'Code', headerName: 'Code', flex: 1, minWidth: 120 },
    { field: 'Name', headerName: 'Name', flex: 2, minWidth: 220 },
    { field: 'ValidFrom', headerName: 'Valid From', flex: 1, minWidth: 140 },
    { field: 'ValidTo', headerName: 'Valid To', flex: 1, minWidth: 140 },
    { field: 'Active', headerName: 'Status', width: 120, sortable: false, renderCell: renderActiveCell }
  ];

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
          <Typography variant="h4">Project Management</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Project Management</Typography>
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
            justifyContent: 'flex-end',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SyncIcon />}
            onClick={handleSync}
            disabled={syncLoading}
            sx={{ minWidth: 160, whiteSpace: 'nowrap' }}
          >
            {syncLoading ? 'Syncing…' : 'Sync Projects'}
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={companyProjectsLoading}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
