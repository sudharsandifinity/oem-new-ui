import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Box,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MaterialReactTable } from 'material-react-table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { getcompanies, syncBranches } from '../../../store/slices/companySlice';
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';

import MainCard from 'ui-component/cards/MainCard';
import HomeIcon from '@mui/icons-material/Home';
import SyncBranchModel from './SyncBranchModel';

const CompaniesList = () => {
  let data = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, listLoading } = useSelector((state) => state.companies);
  const [openSyncBranch, setOpenSyncBranch] = useState(false);
  const [branchList, setBranchlist] = useState([]);
  console.log('company', companies);
  useEffect(() => {
    dispatch(getcompanies());
  }, [dispatch]);
  const handlesyncBranch = async (company) => {
    console.log('handlesyncBranch', company);

    const payload = { company_id: company.id };
    const res = await dispatch(syncBranches(payload)).unwrap();
  };
  const columns = useMemo(
    () => [
      {
        id: 'slNo',
        header: 'Sl No',
        size: 80,
        Cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'company_code',
        header: 'Code'
      },
      {
        accessorKey: 'name',
        header: 'Company Name'
      },
      {
        accessorKey: 'company_db_name',
        header: 'Company DB Name'
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => (
          <Chip label={cell.getValue() === 1 ? 'Active' : 'Inactive'} color={cell.getValue() === 1 ? 'success' : 'error'} />
        )
      },
      {
        accessorKey: 'action',
        header: 'Action',
        sortable: false,
        filterable: false,
        minWidth: 120,
        Cell: ({ cell }) => (
          <Stack direction="row" height="100%" spacing={1}>
            <IconButton size="small" color="primary" onClick={() => navigate(`/Companies/view/${cell.row.original.id}`)}>
              <Visibility fontSize="small" />
            </IconButton>

            <IconButton size="small" color="secondary" onClick={() => navigate(`/Companies/edit/${cell.row.original.id}`)}>
              <Edit fontSize="small" />
            </IconButton>
          </Stack>
        )
      }
    ],
    []
  );

  return (
    <Box>
      {/* HEADER — always visible */}
      <MainCard content={false} sx={{ mb: 3 }}>
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
          <Typography variant="h4">Company management </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Company Management
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              List
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* Page Header */}
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
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}></Box>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setOpenSyncBranch(true)}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Sync Branch
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/Companies/create')}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Add Company
          </Button>
        </Box>
      </Paper>

      {/* Table Card */}
      <Card elevation={1}>
        <CardContent>
          <MaterialReactTable
            columns={columns}
            data={companies}
            enableColumnResizing={true}
            columnResizeMode={onchange}
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
          />
        </CardContent>
      </Card>
      <SyncBranchModel
        open={openSyncBranch}
        onClose={() => setOpenSyncBranch(false)}
        onSelect={handlesyncBranch}
        listLoading={listLoading}
        companyList={companies}
      />
    </Box>
  );
};

export default CompaniesList;
