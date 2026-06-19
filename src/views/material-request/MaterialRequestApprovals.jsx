import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getMRApprovals, approveMR, rejectMR } from '../../store/slices/materialRequestSlice';
import { formatDateDDMMYYYY, renderNoWrapCell } from 'utils/dataGridFormatters';

const STATUS_META = {
  D: { label: 'Draft', color: 'warning' },
  O: { label: 'Open', color: 'success' },
  C: { label: 'Closed', color: 'default' }
};

const renderStatusCell = (params) => {
  const meta = STATUS_META[params.value] || { label: params.value || '—', color: 'default' };
  return <Chip size="small" label={meta.label} color={meta.color} variant="outlined" />;
};

export default function MaterialRequestApprovals() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { approvals, approvalsCount, approvalsLoading, decisionLoading } = useSelector((s) => s.materialRequest);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [confirm, setConfirm] = useState({ open: false, type: null, row: null });
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const loadApprovals = () =>
    dispatch(getMRApprovals({ top: paginationModel.pageSize, skip: paginationModel.page * paginationModel.pageSize }));

  useEffect(() => {
    loadApprovals();
  }, [paginationModel]);

  const openConfirm = (type, row) => setConfirm({ open: true, type, row });
  const closeConfirm = () => {
    if (!decisionLoading) setConfirm({ open: false, type: null, row: null });
  };

  const handleDecision = async () => {
    const { type, row } = confirm;
    const action = type === 'approve' ? approveMR : rejectMR;
    try {
      await dispatch(action(row.DocEntry)).unwrap();
      setSnackbar({
        open: true,
        severity: 'success',
        message: `Material Request ${type === 'approve' ? 'approved' : 'rejected'} successfully!`
      });
      setConfirm({ open: false, type: null, row: null });
      loadApprovals();
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: err || 'Action failed' });
      setConfirm({ open: false, type: null, row: null });
    }
  };

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => approvals.findIndex((r) => r.DocEntry === params.id) + 1
    },
    { field: 'U_PrjCode', headerName: 'Project Code', flex: 1, minWidth: 150 },
    { field: 'U_PrjDesc', headerName: 'Project Name', flex: 1.5, minWidth: 200 },
    { field: 'U_SQDocNum', headerName: 'BOM No', flex: 1, minWidth: 120 },
    { field: 'U_DocDate', headerName: 'Requisition Date', flex: 1, minWidth: 150, valueFormatter: formatDateDDMMYYYY },
    { field: 'U_Remark', headerName: 'Remark', flex: 1.5, minWidth: 180, renderCell: renderNoWrapCell },
    { field: 'U_DocStatus', headerName: 'Status', width: 110, sortable: false, renderCell: renderStatusCell },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 150,
      renderCell: (params) => (
        <Stack direction="row" height="100%" spacing={0.5} alignItems="center">
          <Tooltip title="View">
            <IconButton size="small" color="primary" onClick={() => navigate(`/material-request/view/${params.row.DocEntry}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Approve">
            <IconButton size="small" color="success" onClick={() => openConfirm('approve', params.row)}>
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton size="small" color="error" onClick={() => openConfirm('reject', params.row)}>
              <CancelIcon fontSize="small" />
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
          <Typography variant="h4">Material Request Approvals</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Material Request</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Approvals
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={approvals}
          columns={columns}
          getRowId={(row) => row.DocEntry}
          loading={approvalsLoading}
          paginationMode="server"
          rowCount={approvalsCount}
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

      <Dialog open={confirm.open} onClose={closeConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>{confirm.type === 'approve' ? 'Approve Material Request' : 'Reject Material Request'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirm.type === 'approve' ? 'approve' : 'reject'} this Material Request
            {confirm.row?.U_PrjCode ? ` for project ${confirm.row.U_PrjCode}` : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeConfirm} color="inherit" disabled={decisionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDecision}
            variant="contained"
            color={confirm.type === 'approve' ? 'success' : 'error'}
            disabled={decisionLoading}
            startIcon={decisionLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {confirm.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
