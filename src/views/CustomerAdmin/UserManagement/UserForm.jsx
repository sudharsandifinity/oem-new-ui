import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useLookup } from '../../../context/LookupContext';
import { useState } from 'react';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);

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
          companyIds: company.map((c) => c.company_code),
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
        console.log('Selected projects', projects)
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
      {/* ===== LEFT — Customer / Project / BOM ===== */}
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
       
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
          type="text"
          value={data?.password || ''}
          onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
        />

        
      </Box>

      {/* ===== RIGHT — Requisition details ===== */}
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
       
        
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
        <FormControl sx={{ minWidth: 150 }} disabled={readOnly}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Requestor Type"
            value={data?.status || 'User'}
            onChange={(e) => setData((prev) => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">In Active</MenuItem>
          </Select>
        </FormControl>
        
      </Box>
    </Box>
  );
}
