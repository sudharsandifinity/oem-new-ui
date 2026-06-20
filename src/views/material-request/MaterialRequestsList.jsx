import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, Button, Chip, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getMyMRList } from '../../store/slices/materialRequestSlice';
import { MR_STATUS_META } from './mrHelpers';
import { formatDateDDMMYYYY, renderNoWrapCell } from 'utils/dataGridFormatters';

const renderStatusCell = (params) => {
  const meta = MR_STATUS_META[params.value] || { label: params.value || '—', color: 'default' };
  const chip = <Chip size="small" label={meta.label} color={meta.color} variant="outlined" />;

  if (params.row.U_Apr_remark) {
    return (
      <Tooltip title={`Approver Remark: ${params.row.U_Apr_remark}`} arrow>
        <span>{chip}</span>
      </Tooltip>
    );
  }
  return chip;
};

const emptyFilters = () => ({ ProjectCode: '', ProjectName: '' });

export default function MaterialRequestsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, totalCount, listLoading } = useSelector((s) => s.materialRequest);
  const { user } = useSelector((s) => s.auth);

  const [filters, setFilters] = useState(emptyFilters());
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    dispatch(
      getMyMRList({
        top: paginationModel.pageSize,
        skip: paginationModel.page * paginationModel.pageSize,
        email: user?.email || ''
      })
    );
  }, [paginationModel, user?.email, dispatch]);

  const filteredRows = useMemo(() => {
    const { ProjectCode, ProjectName } = filters;
    const mrRows = (Array.isArray(list) ? list : []).filter((r) => r && r.DocEntry != null);
    return mrRows.filter((r) => {
      if (
        ProjectCode &&
        !String(r.U_PrjCode ?? '')
          .toLowerCase()
          .includes(ProjectCode.toLowerCase())
      )
        return false;
      if (
        ProjectName &&
        !String(r.U_PrjDesc ?? '')
          .toLowerCase()
          .includes(ProjectName.toLowerCase())
      )
        return false;
      return true;
    });
  }, [list, filters]);

  const clearFilters = () => setFilters(emptyFilters());

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => filteredRows.findIndex((r) => r.DocEntry === params.id) + 1
    },
    { field: 'U_PrjCode', headerName: 'Project Code', flex: 1, minWidth: 150 },
    { field: 'U_PrjDesc', headerName: 'Project Name', flex: 1.5, minWidth: 200 },
    { field: 'U_SQDocNum', headerName: 'BOM No', flex: 1, minWidth: 120 },
    { field: 'U_DocDate', headerName: 'Requisition Date', flex: 1, minWidth: 150, valueFormatter: formatDateDDMMYYYY },
    { field: 'U_Remark', headerName: 'Remark', flex: 1.5, minWidth: 180, renderCell: renderNoWrapCell },
    { field: 'U_DocStatus', headerName: 'Status', width: 120, sortable: false, renderCell: renderStatusCell },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 120,
      renderCell: (params) => {
        const isApproved = params.row.U_DocStatus === 'O';
        return (
          <Stack direction="row" height="100%" spacing={1}>
            <IconButton size="small" color="primary" onClick={() => navigate(`/material-request/view/${params.row.DocEntry}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <Tooltip title={isApproved ? 'Approved requests cannot be edited' : 'Edit'}>
              <span>
                <IconButton
                  size="small"
                  color="secondary"
                  disabled={isApproved}
                  onClick={() => navigate(`/material-request/edit/${params.row.DocEntry}`)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      }
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
          <Typography variant="h4">Material Request</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Material Request</Typography>
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
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
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
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/material-request/create')}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Create
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredRows}
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
