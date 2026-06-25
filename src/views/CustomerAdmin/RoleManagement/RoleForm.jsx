import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useLookup } from '../../../context/LookupContext';
import { useState } from 'react';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);

export default function UserForm({ data, setData, readOnly = false, lockCustomerProject = false }) {
  const { openLookup } = useLookup();



  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const isDisabled = readOnly;
  const projectDisabled = readOnly || lockCustomerProject;


const handleOpenUserMenuLookup=()=>{
   openLookup({
      type: 'UserMenuproject',
      multiSelect: true,
       selectedIds: data.userMenuIds || [],

      onSelect: (menu) => {
         const menus = Array.isArray(menu) ? menu : [menu];
        console.log('Selected menus', menus)
        const uniqueMenus = Array.from(
  new Map(menus.map((item) => [item.id, item])).values()
);

setData((prev) => ({
  ...prev,
  userMenuIds: uniqueMenus.map((p) => p.id),
  menuNames: uniqueMenus.map((p) => p.name).join(", "),
  parentIds: [...new Set(uniqueMenus.map((p) => p.parentId).filter(Boolean))],
  parentNames: [...new Set(uniqueMenus.map((p) => p.parentname).filter(Boolean))].join(", "),
}));
      }
    });
}
  const handleOpenCompanyLookup = () => {
    openLookup({
      type: 'company',
      //multiSelect: true,
      onSelect: (company) => {
         const project = Array.isArray(company) ? company : [company];
        console.log('Selected company', company)
        setData((prev) => ({
          ...prev,
          //projects: projects,
          companyId: company.id,
          companyNames: company.name
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
          label="Name"
          disabled={isDisabled}
          value={data?.name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
        />

        <TextField
          fullWidth
          label="company"
          value={data?.companyNames || ''}
          disabled={isDisabled}

          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={isDisabled} onClick={!isDisabled ? handleOpenCompanyLookup : undefined}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        
      </Box>

      {/* ===== RIGHT — Requisition details ===== */}
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
       
        
       
       
        <TextField
          fullWidth
          label="Menu"
          value={data?.menuNames || ''}
          disabled={isDisabled}

          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={isDisabled} onClick={!isDisabled ? handleOpenUserMenuLookup : undefined}>
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
            value={data?.status || 1}
                  disabled={isDisabled}

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
