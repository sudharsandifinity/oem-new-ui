import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useLookup } from '../../context/LookupContext';
import AppDatePicker from 'ui-component/AppDatePicker';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);

export default function MRGeneralTab({ data, setData, readOnly = false, lockCustomerProject = false }) {
  const { openLookup } = useLookup();

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const customerDisabled = readOnly || lockCustomerProject;
  const projectDisabled = readOnly || lockCustomerProject;

  const handleOpenCustomerLookup = () => {
    openLookup({
      type: 'customer',
      onSelect: (customer) => {
        setData((prev) => ({
          ...prev,
          CardCode: customer.CardCode,
          CardName: customer.CardName
        }));
      }
    });
  };

  const handleOpenProjectLookup = () => {
    openLookup({
      type: 'project',
      onSelect: (project) => {
        setData((prev) => ({
          ...prev,
          ProjectCode: project.Code,
          ProjectName: project.Name
        }));
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Customer"
          value={data?.CardCode || ''}
          onChange={(e) => !customerDisabled && handleChange('CardCode', e.target.value)}
          disabled={customerDisabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={!customerDisabled ? handleOpenCustomerLookup : undefined} disabled={customerDisabled}>
                  <PersonSearchIcon sx={{ color: customerDisabled ? 'text.disabled' : '#2196f3' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField fullWidth label="Name" value={data?.CardName || ''} disabled />

        <TextField
          fullWidth
          label="Project Code"
          value={data?.ProjectCode || ''}
          onChange={(e) => !projectDisabled && handleChange('ProjectCode', e.target.value)}
          disabled={projectDisabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={!projectDisabled ? handleOpenProjectLookup : undefined} disabled={projectDisabled}>
                  <AccountTreeIcon sx={{ color: projectDisabled ? 'text.disabled' : '#2196f3' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField fullWidth label="Project Name" value={data?.ProjectName || ''} disabled />

        <TextField fullWidth label="BOM No" value={data?.BOMNo || ''} disabled />
      </Box>

      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField fullWidth label="Requisition Number" value={data?.RequisitionNo || ''} disabled />

        <AppDatePicker label="Requisition Date" value={data?.RequisitionDate || today} disabled />

        <TextField
          fullWidth
          type="time"
          label="Requisition Time"
          value={data?.RequisitionTime || nowTime}
          disabled
          InputLabelProps={{ shrink: true }}
        />

        <AppDatePicker
          label="Required Date"
          value={data?.RequiredDate || today}
          onChange={(val) => !readOnly && handleChange('RequiredDate', val)}
          disabled={readOnly}
        />
      </Box>
    </Box>
  );
}
