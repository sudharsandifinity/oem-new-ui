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

export default function CompanyForm({ data, setData, readOnly = false, lockCompanyPassword = false }) {
  const { openLookup } = useLookup();
  const [is_super_company, setIs_super_company] = useState('0');
  const [is_com_admin, setIs_com_admin] = useState('0');

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
    <Box sx={{flexDirection: 'column'}}> 
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
          label="Company Name"
          disabled={idDisabled}
          value={data?.name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, name: (e.target.value).trim() }))}
        />
    
        <TextField
          fullWidth
          label="Company DB Name"
          disabled={idDisabled}
          value={data?.company_db_name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, company_db_name: (e.target.value).trim() }))}
        />

        <TextField
          fullWidth
          disabled={idDisabled}
          label="Company Code"
          value={data?.company_code || ''}
          onChange={(e) => setData((prev) => ({ ...prev, company_code: (e.target.value).trim() }))}
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
          label="base URL"
          disabled={idDisabled}
          value={data?.base_url || ''}
                   onChange={(e) => setData((prev) => ({ ...prev, base_url: (e.target.value).trim() }))}

        />
        <TextField
          fullWidth
          label="SAP User Name"
          disabled={idDisabled}
          value={data?.sap_username || ''}
                    onChange={(e) => setData((prev) => ({ ...prev, sap_username: (e.target.value).trim() }))}

        />

        <TextField
          fullWidth
          label="Secret Key"
          disabled={idDisabled}
          value={data?.secret_key || ''}
                   onChange={(e) => setData((prev) => ({ ...prev, secret_key: (e.target.value).trim() }))}

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
      </Box> </Box>
      <Box>Branch List
        <DataGrid rows={data?.branches} columns={columns} autoHeight  />
      </Box>
   
    </Box>
  );
}