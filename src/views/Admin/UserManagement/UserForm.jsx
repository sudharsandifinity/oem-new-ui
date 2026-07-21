import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useLookup } from '../../../context/LookupContext';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { DataGrid } from '@mui/x-data-grid';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}));

export default function UserForm({ data, setData, readOnly = false, lockUserPassword = false }) {
  const { openLookup } = useLookup();
  const [is_super_User, setIs_super_User] = useState('0');
  const [is_com_admin, setIs_com_admin] = useState('0');
  const [errorMsg, setErrorMsg] = useState({
    roleError: '',
    projectError: ''
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    companyNames: '',
    roleNames: '',
    projectNames: ''
  });

  const validateField = (field, value) => {
    let message = '';

    switch (field) {
      case 'first_name':
        if (!value.trim()) message = 'First Name is required';
        break;

      case 'last_name':
        if (!value.trim()) message = 'Last Name is required';
        break;

      case 'email':
        if (!value.trim()) message = 'Email is required';
        break;

      case 'password':
        if (!value.trim()) message = 'Password is required';
        break;

      case 'companyNames':
        if (!value.trim()) message = 'Company Names is required';
        break;

      case 'roleNames':
        if (!value.trim()) message = 'Role Names is required';
        break;

      case 'projectNames':
        if (!value.trim()) message = 'Project Names is required';
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: message
    }));

    return message === '';
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const idDisabled = readOnly;
  const passwordDisabled = readOnly || lockUserPassword;

  const handleOpenUserLookup = () => {
    openLookup({
      type: 'User',
      multiSelect: true,
      selectedIds: data?.UserIds || [],

      onSelect: (companies) => {
        const User = Array.isArray(companies) ? companies : [companies];
        console.log('Selected companies', User);
        setData((prev) => ({
          ...prev,
          //companies: companies,
          UserIds: User.map((c) => c.id),
          UserNames: User.map((c) => c.name).join(', ')
        }));
      }
    });
  };

  const handleOpenRoleLookup = () => {
    if (!data?.companyIds) {
      setErrorMsg((prev) => ({ ...prev, roleError: 'Please select a company first' }));
      return;
    } else {
      setErrorMsg((prev) => ({ ...prev, roleError: '' }));

    }
    openLookup({
      type: 'adminrole',
      multiSelect: true,
      selectedIds: data?.roleIds || [],
      companyId: data.companyIds,
      onSelect: (role) => {
        const roles = Array.isArray(role) ? role : [role];
        console.log('Selected Roles', roles);
        setData((prev) => ({
          ...prev,
          //roles: role,
          roleIds: roles?.map((r) => r.id),
          roleNames: roles?.map((r) => r.name).join(', ')
        }));
      }
    });
  };

  const handleOpenProjectLookup = () => {
    if (!data?.companyIds) {
      setErrorMsg((prev) => ({ ...prev, projectError: 'Please select a company first' }));
      return;
    } else {
      setErrorMsg((prev) => ({ ...prev, projectError: '' }));

    }
    openLookup({
      type: 'project',
      multiSelect: true,
      selectedIds: data?.projectIds || [],

      onSelect: (projects) => {
        const project = Array.isArray(projects) ? projects : [projects];
        console.log('Selected projects', projects);
        setData((prev) => ({
          ...prev,
          //projects: projects,
          projectIds: project.map((p) => p.id),
          projectNames: project.map((p) => p.Name).join(', ')
        }));
      }
    });
  };
  const handleOpenCompanyLookup = () => {
    openLookup({
      type: 'admincompany',
      multiSelect: true,
      selectedIds: data?.companyIds || [],

      onSelect: (companies) => {
        const company = Array.isArray(companies) ? companies : [companies];
        console.log('Selected companies', company);
        setData((prev) => ({
          ...prev,
          //companies: companies,
          companyIds: company.map((c) => c.id),
          companyNames: company.map((c) => c.name).join(', ')
        }));
        setErrorMsg((prev) => ({ ...prev, roleError: '', projectError: '' }));

      }
    });
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
        header: ' Name'
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
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {/* LEFT */}
      <Box
        sx={{
          flex: 1,
          minWidth: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <TextField
          fullWidth
          required
          label="First Name"
          disabled={idDisabled}
          value={data?.first_name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, first_name: (e.target.value).trim() }))}
          onBlur={(e) => validateField('first_name', e.target.value)}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />

        <TextField
          fullWidth
          required
          label="Last Name"
          disabled={idDisabled}
          value={data?.last_name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, last_name: (e.target.value).trim() }))}
          onBlur={(e) => validateField('last_name', e.target.value)}
          error={!!errors.last_name}
          helperText={errors.last_name}
        />

        <TextField
          fullWidth
          required
          disabled={passwordDisabled}
          label="Email"
          value={data?.email || ''}
          onChange={(e) => setData((prev) => ({ ...prev, email: (e.target.value).trim() }))}
          onBlur={(e) => validateField('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        {!passwordDisabled && <TextField
          fullWidth
          required
          disabled={idDisabled}
          label="Password"
          type="password"
          value={data?.password || ''}
          onChange={(e) => setData((prev) => ({ ...prev, password: (e.target.value).trim() }))}
          onBlur={(e) => validateField('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />}
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          minWidth: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <TextField
          fullWidth
          label="Company"
          required
          disabled={idDisabled}
          value={data?.companyNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={idDisabled} onClick={!idDisabled ? handleOpenCompanyLookup : undefined}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {errorMsg?.roleError ? (
          <Typography
            color="error"
            sx={{ mb: 0.5, display: 'block' }}
          >
            {errorMsg.roleError}
          </Typography>
        ) : null}
        <TextField
          fullWidth
          required
          label="Role"
          disabled={idDisabled}
          value={data?.roleNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={idDisabled} onClick={!idDisabled ? handleOpenRoleLookup : undefined}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {errorMsg?.projectError ? (
          <Typography
            color="error"
            sx={{ mb: 0.5, display: 'block' }}
          >
            {errorMsg.projectError}
          </Typography>
        ) : null}
        <TextField
          fullWidth
          required
          label="Project"
          disabled={idDisabled}
          value={data?.projectNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={idDisabled} onClick={!idDisabled ? handleOpenProjectLookup : undefined} >
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Box
          sx={{
            height: 56,
            px: 2,
            display: 'flex',
            gap: 20,
            alignItems: 'center'
          }}
        >
          <FormControlLabel
            control={
              <Android12Switch
                disabled={idDisabled}

                checked={data?.status === 1}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    status: e.target.checked ? 1 : 0
                  }))
                }
              />
            }
            label="Status"
          />
          <FormControlLabel
            control={
              <Android12Switch
                disabled={idDisabled}

                checked={data?.is_super_user === 1}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    is_super_user: e.target.checked ? 1 : 0
                  }))
                }
              />
            }
            label="Is Super User"
          />
          <FormControlLabel
            control={
              <Android12Switch
                disabled={idDisabled}

                checked={data?.is_com_admin === 1}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    is_com_admin: e.target.checked ? 1 : 0
                  }))
                }
              />
            }
            label="Is Company Admin"
          />
        </Box>
      </Box>
    </Box>
  );
}