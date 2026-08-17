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
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';

import MainCard from 'ui-component/cards/MainCard';
import HomeIcon from '@mui/icons-material/Home';
import { getforms } from '../../../store/slices/FormSlice';

const FormList = () => {
  let data = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, listLoading } = useSelector((state) => state.forms);
  useEffect(() => {
    dispatch(getforms());
  }, [dispatch]);
 
  const columns = useMemo(
    () => [
       {
    id: 'slNo',
    header: 'Sl No',
    size: 80,
    Cell: ({ row }) => row.index + 1,
  },
      {
        accessorKey: 'name',
        header: 'Forms Name'
      },
      {
        accessorKey: 'display_name',
        header: 'Display Name'
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
          <Typography variant="h4">Forms management </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main', cursor: 'pointer'  }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Form Management
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
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/Companies/create')}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Add Form
          </Button>
        </Box>
      </Paper>

      {/* Table Card */}
      <Card elevation={1}>
        <CardContent>
          <MaterialReactTable
            columns={columns}
            data={forms}
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
      
    </Box>
  );
};

export default FormList;