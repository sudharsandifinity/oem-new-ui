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
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MaterialReactTable } from 'material-react-table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';

import MainCard from 'ui-component/cards/MainCard';
import HomeIcon from '@mui/icons-material/Home';
import { deleteRole, getroles } from '../../../store/slices/roleSlice';
import { getcompanies } from '../../../store/slices/companySlice';

const RoleList = () => {
  let data = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles, listLoading, saveSuccess, error } = useSelector((state) => state.roles);
  const { companies } = useSelector((state) => state.companies);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    dispatch(getroles());
    dispatch(getcompanies());
  }, [dispatch]);
  console.log("companies", companies)
  const DeleteRow = async () => {
    const result = await dispatch(deleteRole(roleToDelete));

    if (deleteRole.fulfilled.match(result)) {

      setSnackbar({ open: true, severity: 'success', message: 'Role Deleted successfully!' });
    setOpenDeleteModal(false)

      dispatch(getroles());
    } else {
      setSnackbar({ open: true, severity: 'error', message: error });

    }
  }
  const DeleteRole = async (roleId) => {
    // Implementation for deleting a role
    setOpenDeleteModal(true)
    setRoleToDelete(roleId);




  };
  const handleClose = () => {
    setOpenDeleteModal(false);
  };

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
        header: 'Roles Name'
      },
      {
        accessorKey: 'display_name',
        header: 'Company',
        Cell: ({ cell }) => companies?.find((com) => com.id === String(cell.row.original.companyId))?.name || "-"

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
            <IconButton size="small" color="primary" onClick={() => navigate(`/Roles/view/${cell.row.original.id}`)}>
              <Visibility fontSize="small" />
            </IconButton>

            <IconButton size="small" color="secondary" onClick={() => navigate(`/Roles/edit/${cell.row.original.id}`)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" color="secondary" onClick={() => DeleteRole(cell.row.original.id)}>
              <Delete fontSize="small" />
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
          <Typography variant="h4">Roles management </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Role Management
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
            onClick={() => navigate('/Roles/create')}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Add Role
          </Button>
        </Box>
      </Paper>

      {/* Table Card */}
      <Card elevation={1}>
        <CardContent>
          <MaterialReactTable
            columns={columns}
            data={roles}
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
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Role"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this role? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} autoFocus>
            Cancel
          </Button>
          <Button onClick={DeleteRow}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default RoleList