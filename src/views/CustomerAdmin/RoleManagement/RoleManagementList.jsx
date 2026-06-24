import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import {  getadminRoles } from '../../../store/slices/roleSlice';
import { getadminCompanies } from '../../../store/slices/commonCustomerSlice';

const emptyFilters = () => ({ DocEntry: '', ProjectCode: '', ProjectName: '' });

export default function RoleManagementList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((s) => s.commonCustomer);
  const { roles, rolesLoading } = useSelector((s) => s.role);



  const [filters, setFilters] = useState(emptyFilters());
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
{console.log("companies",companies)}
  useEffect(() => {
    dispatch(
      getadminRoles()
      
    );
    dispatch(getadminCompanies())
  }, [paginationModel, dispatch]);

  


const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 120,
   
  },
  
  {
    field: "companies",
    headerName: "companyId",
    flex: 1.5,
    minWidth: 200,
    valueGetter: (_, row) =>
    companies?.find((com) => com.id===row.companyId)?.name|| "-"
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 150,
    valueGetter: (_, row) =>row.status==1?"Active":"In Active"
  },
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    filterable: false,
    minWidth: 120,
    renderCell: (params) => (
      <Stack direction="row" height="100%" spacing={1}>
        <IconButton
          size="small"
          color="primary"
          onClick={() =>
            navigate(`/RoleManagement/view/${params.row.id}`)
          }
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          color="secondary"
          onClick={() =>
            navigate(`/RoleManagement/edit/${params.row.id}`) 
          }
        >
          <EditIcon fontSize="small" />
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
            px: 3,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h4">Role management </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Role Management </Typography>
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
      {/* Filters */}
     
          {console.log("first",roles)}
      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={roles}
          columns={columns}
          getRowId={(row) => row.id}
          loading={rolesLoading}
          paginationMode="server"
          rowCount={roles?.length}
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