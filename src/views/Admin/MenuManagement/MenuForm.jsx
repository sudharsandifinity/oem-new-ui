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

export default function MenuForm({ data, setData, readOnly = false, lockMenuPassword = false }) {
  const { openLookup } = useLookup();
  const [is_super_Menu, setIs_super_Menu] = useState('0');
  const [is_com_admin, setIs_com_admin] = useState('0');

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const idDisabled = readOnly;
  const passwordDisabled = readOnly || lockMenuPassword;

  const handleOpenMenuLookup = () => {
    openLookup({
      type: 'adminMenu',
      //multiSelect: true,
      //selectedIds: data?.MenuIds || [],

      onSelect: (menu) => {
        setData((prev) => ({
          ...prev,
          //companies: companies,
          MenuId: menu.id,
          MenuNames: menu.name
        }));
      }
    });
  };



  const handleOpenFormLookup = () => {
    openLookup({
      type: 'adminForm',
      //multiSelect: true,
      //selectedIds: data?.FormIds || [],

      onSelect: (form) => {
        setData((prev) => ({
          ...prev,
          //forms: forms,
          FormId: form.id,
          formNames: form.name
        }));
      }
    });
  };
  const handleOpenCompanyLookup = () => {
    openLookup({
      type: 'admincompany',
     // multiSelect: true,
      //selectedIds: data?.companyIds || [],

      onSelect: (company) => {
        setData((prev) => ({
          ...prev,
          //companies: companies,
          companyId: company.id,
          companyNames: company.name
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
        Cell: ({ row }) => row.index + 1
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
          label="Menu Form Name"
          disabled={idDisabled}
          value={data?.name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value.trim() }))}
        />

        <TextField
          fullWidth
          label="Display Name"
          disabled={idDisabled}
          value={data?.display_name || ''}
          onChange={(e) => setData((prev) => ({ ...prev, display_name: e.target.value.trim() }))}
        />
        <FormControl fullWidth disabled={readOnly}>
          <InputLabel>Scope</InputLabel>
          <Select label="Scope" value={data?.scope || '1'} onChange={(e) => setData((prev) => ({ ...prev, scope: e.target.value }))}>
            <MenuItem value="global">Global</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            <MenuItem value="branch">Branch</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Company"
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
          label="Parent"
          disabled={idDisabled}
          value={data?.MenuNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={idDisabled} onClick={!idDisabled ? handleOpenMenuLookup : undefined}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          label="Form"
          disabled={idDisabled}
          value={data?.formNames || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={idDisabled} onClick={!idDisabled ? handleOpenFormLookup : undefined}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          label="Order Number"
          disabled={idDisabled}
          value={data?.order_number || ''}
          onChange={(e) => setData((prev) => ({ ...prev, order_number: e.target.value.trim() }))}
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
      </Box>
    </Box>
  );
}
