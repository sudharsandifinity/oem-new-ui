import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { getMyApprovals } from '../../store/slices/approvalSlice';
import { formatDateDDMMYYYY, renderNoWrapCell } from 'utils/dataGridFormatters';

export default function MyApprovalsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, count, listLoading, error } = useSelector((s) => s.approval);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [status, setStatus] = useState('pending');
  const [filters, setFilters] = useState({ ProjectCode: '', ProjectName: '' });

  const load = () => {
    dispatch(
      getMyApprovals({ docType: 'MR', status, top: paginationModel.pageSize, skip: paginationModel.page * paginationModel.pageSize })
    );
  };

  useEffect(() => {
    load();
  }, [paginationModel, status]);

  const handleStatusChange = (next) => {
    if (next === status) return;
    setStatus(next);
    setPaginationModel((p) => ({ ...p, page: 0 }));
  };

  const clearFilters = () => {
    setFilters({ ProjectCode: '', ProjectName: '' });
    handleStatusChange('pending');
  };

  const rows = useMemo(() => {
    const base = (Array.isArray(list) ? list : []).filter((r) => r && r.approvalRequestId != null);
    const { ProjectCode, ProjectName } = filters;
    return base.filter((r) => {
      if (ProjectCode && !String(r.U_PrjCode ?? '').toLowerCase().includes(ProjectCode.toLowerCase())) return false;
      if (ProjectName && !String(r.U_PrjDesc ?? '').toLowerCase().includes(ProjectName.toLowerCase())) return false;
      return true;
    });
  }, [list, filters]);

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => rows.findIndex((r) => r.approvalRequestId === params.id) + 1
    },
    { field: 'U_PrjCode', headerName: 'Project Code', flex: 1, minWidth: 140 },
    { field: 'U_PrjDesc', headerName: 'Project Name', flex: 1.5, minWidth: 180 },
    { field: 'U_SQDocNum', headerName: 'BOM No', flex: 1, minWidth: 110 },
    { field: 'U_DocDate', headerName: 'Requisition Date', flex: 1, minWidth: 150, valueFormatter: formatDateDDMMYYYY },
    { field: 'U_Remark', headerName: 'Remark', flex: 1.5, minWidth: 160, renderCell: renderNoWrapCell },
    {
      field: 'currentStageOrder',
      headerName: 'Stage',
      width: 150,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => {
        const s = params.row.approvalStatus;
        if (s === 'approved') return <Chip size="small" label="Approved" color="success" variant="outlined" />;
        if (s === 'sent_back') return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
        return <Chip size="small" label={`Stage ${params.value}`} color="info" variant="outlined" />;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 80,
      renderCell: (params) => (
        <Stack direction="row" height="100%" spacing={0.5} alignItems="center">
          <Tooltip title="Review">
            <IconButton size="small" color="primary" onClick={() => navigate(`/my-approvals/view/${params.row.approvalRequestId}`)}>
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
          <Typography variant="h4">My Approvals</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Approvals</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              My Approvals
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="sent_back">Rejected</MenuItem>
            </Select>
          </FormControl>
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
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, flexShrink: 0 }}
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon fontSize="small" />} onClick={load}>
              Retry
            </Button>
          }
        >
          {typeof error === 'string' ? error : 'Failed to load approvals'}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.approvalRequestId}
          loading={listLoading}
          paginationMode="server"
          rowCount={count}
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
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e0e0e0', backgroundColor: '#fafafa', overflow: 'hidden' },
            '& .MuiDataGrid-scrollbarFiller': { display: 'none' }
          }}
        />
      </Paper>
    </Box>
  );
}
