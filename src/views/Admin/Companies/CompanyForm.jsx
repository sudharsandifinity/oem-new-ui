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
import { MaterialReactTable } from 'material-react-table';


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

export default function CompanyForm({ data, setData, readOnly = false, lockCompanyPassword = false, mode }) {
  const { openLookup } = useLookup();
  const [is_super_company, setIs_super_company] = useState('0');
  const [is_com_admin, setIs_com_admin] = useState('0');
  const [errors, setErrors] = useState({
    name: '',
    company_db_name: '',
    company_code: '',
    max_users: '',
    base_url: '',
    sap_username: '',
    secret_key: ''
  });
  
  const validateField = (field, value) => {
    let message = '';

    switch (field) {
      case 'name':
        if (!value.trim()) message = 'Company Name is required';
        break;

      case 'company_db_name':
        if (!value.trim()) message = 'Company DB Name is required';
        break;

      case 'company_code':
        if (!value.trim()) message = 'Company Code is required';
        break;

      case 'max_users':
        if (!value) {
          message = 'Maximum Users is required';
        } else if (Number(value) <= 0) {
          message = 'Maximum Users must be greater than 0';
        }
        break;

      case 'base_url':
        if (!value.trim()) {
          message = 'Base URL is required';
        } else {
          try {
            new URL(value);
          } catch {
            message = 'Enter a valid URL';
          }
        }
        break;

      case 'sap_username':
        if (!value.trim()) message = 'SAP User Name is required';
        break;

      case 'secret_key':
        if (!value.trim()) message = 'Secret Key is required';
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
  const passwordDisabled = readOnly || lockCompanyPassword;

  const handleOpenCompanyLookup = () => {
    openLookup({
      type: 'company',
      multiSelect: true,
      selectedIds: data.companyIds || [],

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
      selectedIds: data.roleIds || [],
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
      selectedIds: data.projectIds || [],

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
  const columns = useMemo(
    () => [
      {
        id: 'slNo',
        header: 'Sl No',
        size: 80,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'BPLName',
        header: ' Name'
      },
      {
        accessorKey: 'City',
        header: ' City'
      },
      {
        accessorKey: 'State',
        header: ' State'
      },
    ],
    []
  );
  return (
    <Box sx={{ flexDirection: 'column' }}>
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
            label="Company Name"
            disabled={idDisabled}
            value={data?.name || ''}
            onChange={(e) => setData((prev) => ({ ...prev, name: (e.target.value).trim() }))}
            onBlur={(e) => validateField('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
          fullWidth
          required
            label="Company DB Name"
            disabled={idDisabled}
            value={data?.company_db_name || ''}
            onChange={(e) => setData((prev) => ({ ...prev, company_db_name: (e.target.value).trim() }))}
            onBlur={(e) => validateField('company_db_name', e.target.value)}
            error={!!errors.company_db_name}
            helperText={errors.company_db_name}
          />

          <TextField
          fullWidth
          required
            fullWidth
            disabled={idDisabled}
            label="Company Code"
            value={data?.company_code || ''}
            onChange={(e) => setData((prev) => ({ ...prev, company_code: (e.target.value).trim() }))}
            onBlur={(e) => validateField('company_code', e.target.value)}
            error={!!errors.company_code}
            helperText={errors.company_code}
          />
          <TextField
            fullWidth
            disabled={idDisabled}
            label="Max Users"
            type='number'
            value={data?.max_users || ''}
            onChange={(e) => setData((prev) => ({ ...prev, max_users: (e.target.value).trim() }))}
            onBlur={(e) => validateField('max_users', e.target.value)}
            error={!!errors.max_users}
            helperText={errors.max_users}
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
          required
            label="base URL"
            disabled={idDisabled}
            value={data?.base_url || ''}
            onChange={(e) => setData((prev) => ({ ...prev, base_url: (e.target.value).trim() }))}
            onBlur={(e) => validateField('base_url', e.target.value)}
            error={!!errors.base_url}
            helperText={errors.base_url}
          />
          <TextField
          fullWidth
          required
            label="SAP User Name"
            disabled={idDisabled}
            value={data?.sap_username || ''}
            onChange={(e) => setData((prev) => ({ ...prev, sap_username: (e.target.value).trim() }))}
            onBlur={(e) => validateField('sap_username', e.target.value)}
            error={!!errors.sap_username}
            helperText={errors.sap_username}
          />

          <TextField
          fullWidth
          required
            label="Secret Key"
            disabled={idDisabled}
            value={data?.secret_key || ''}
            onChange={(e) => setData((prev) => ({ ...prev, secret_key: (e.target.value).trim() }))}
            onBlur={(e) => validateField('secret_key', e.target.value)}
            error={!!errors.secret_key}
            helperText={errors.secret_key}
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
                  disabled={idDisabled}
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
        </Box> </Box>
      {mode !== 'create' && (
        <Box sx={{ mt: 5 }}>

          {console.log("data?.branches", data?.branches)}
          <MaterialReactTable
            columns={columns}
            data={data?.branches && data?.branches.length > 0 ? data?.branches : []}
            renderTopToolbarCustomActions={() => (
              <Typography variant="h4" sx={{ ml: 2 }}>
                Branch List
              </Typography>
            )}
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
        </Box>
      )}

    </Box>
  );
}