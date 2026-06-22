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
  TextField
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useLookup } from '../../../context/LookupContext';
import { useState } from 'react';
import styled from '@emotion/styled';

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

export default function UserForm({ data, setData, readOnly = false, lockCustomerProject = false }) {
  const { openLookup } = useLookup();
  const [is_super_user, setIs_super_user] = useState('0');
  const [is_com_admin, setIs_com_admin] = useState('0');

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const customerDisabled = readOnly || lockCustomerProject;
  const projectDisabled = readOnly || lockCustomerProject;

  const handleOpenCompanyLookup = () => {
    openLookup({
      type: 'company',
      multiSelect: true,
      onSelect: (companies) => {
        const company = Array.isArray(companies) ? companies : [companies];
        console.log('Selected companies', company);
        setData((prev) => ({
          ...prev,
          //companies: companies,
          companyIds: company.map((c) => c.id),
          companyNames: company.map((c) => c.name).join(', ')
        }));
      }
    });
  };

  const handleOpenRoleLookup = () => {
    openLookup({
      type: 'role',
      multiSelect: true,
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
    openLookup({
      type: 'cusadminproject',
      multiSelect: true,
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
          label="First Name"
          value={data?.first_name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, first_name: e.target.value }))}
        />

        <TextField
          fullWidth
          label="Last Name"
          value={data?.last_name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, last_name: e.target.value }))}
        />

        <TextField
          fullWidth
          label="Email"
          value={data?.email || ''}
          onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={data?.password || ''}
          onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
        />
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
          value={data?.companyNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleOpenCompanyLookup}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          label="Role"
          value={data?.roleNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleOpenRoleLookup}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          label="Project"
          value={data?.projectNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleOpenProjectLookup}>
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
            gap: 60,
            alignItems: 'center'
          }}
        >
          <FormControlLabel
            control={
              <Android12Switch
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
        </Box>
      </Box>
    </Box>
  );
}
