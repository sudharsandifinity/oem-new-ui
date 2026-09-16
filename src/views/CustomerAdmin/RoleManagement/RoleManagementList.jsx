import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, Button, Chip, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getadminRoles } from '../../../store/slices/roleSlice';
import { getadminCompanies } from '../../../store/slices/commonCustomerSlice';
import { renderNoWrapCell } from 'utils/dataGridFormatters';

const emptyFilters = () => ({ name: '', company: '' });

export default function RoleManagementList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((s) => s.commonCustomer);
  const { roles, rolesLoading } = useSelector((s) => s.role);

  const [filters, setFilters] = useState(emptyFilters());
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    dispatch(getadminRoles());
    dispatch(getadminCompanies());
  }, [dispatch]);

  const companyName = (companyId) => companies?.find((com) => com.id === companyId)?.name || '-';

  const filteredRows = useMemo(() => {
    const { name, company } = filters;
    const rows = (Array.isArray(roles) ? roles : []).filter((r) => r && r.id != null);
    return rows.filter((r) => {
      if (
        name &&
        !String(r.name ?? '')
          .toLowerCase()
          .includes(name.trim().toLowerCase())
      )
        return false;
      if (company && !companyName(r.companyId).toLowerCase().includes(company.trim().toLowerCase())) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, filters, companies]);

  const clearFilters = () => setFilters(emptyFilters());

  const columns = [
    {
      field: 'sno',
      headerName: '#',
      align: 'center',
      headerAlign: 'center',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => filteredRows.findIndex((r) => r.id === params.id) + 1
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160, renderCell: renderNoWrapCell },
    {
      field: 'companies',
      headerName: 'Company',
      flex: 1.5,
      minWidth: 200,
      valueGetter: (_, row) => companyName(row.companyId),
      renderCell: renderNoWrapCell
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) =>
        Number(params.row.status) === 1 ? (
          <Chip size="small" label="Active" color="success" variant="outlined" />
        ) : (
          <Chip size="small" label="Inactive" color="default" variant="outlined" />
        )
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 120,
      renderCell: (params) => (
        <Stack direction="row" height="100%" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => navigate(`/RoleManagement/view/${params.row.id}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="secondary" onClick={() => navigate(`/RoleManagement/edit/${params.row.id}`)}>
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
          <Typography variant="h4">Role Management</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Role Management</Typography>
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
              label="Name"
              value={filters.name}
              onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            />
            <TextField
              size="small"
              label="Company"
              value={filters.company}
              onChange={(e) => setFilters((p) => ({ ...p, company: e.target.value }))}
            />
            <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearFilters}>
              Clear
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/RoleManagement/create')}
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
          getRowId={(row) => row.id}
          loading={rolesLoading}
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
            '& .MuiDataGrid-cell': {
              borderColor: '#f1f1f1',
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiDataGrid-cell .MuiTypography-root': { width: '100%' },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa'
            }
          }}
        />
      </Paper>
    </Box>
  );
}
