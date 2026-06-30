import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AppDatePicker from 'ui-component/AppDatePicker';

const today = new Date().toISOString().split('T')[0];

export default function PRGeneralTab({ data, setData, readOnly = false }) {
  const handleChange = (field, value) => {
    if (!readOnly) setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth size="medium" disabled>
            <InputLabel>Requestor Type</InputLabel>
            <Select label="Requestor Type" value={data?.RequestorTypeLabel || ''}>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="">—</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth label="Requestor Code" value={data?.ReqCode || ''} disabled />
        </Box>

        <TextField fullWidth label="Requestor Name" value={data?.RequestorName || ''} disabled />

        <TextField fullWidth label="Department" value={data?.Department || ''} disabled />

        <TextField fullWidth label="MR No" value={data?.MRNo ?? ''} disabled />
      </Box>

      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField fullWidth label="Project Code" value={data?.ProjectCode || ''} disabled />

        <TextField fullWidth label="Project Name" value={data?.ProjectName || ''} disabled />

        <AppDatePicker label="Posting Date" value={data?.DocDate || today} disabled />

        <AppDatePicker
          label="Required Date"
          value={data?.RequiredDate || ''}
          onChange={(val) => handleChange('RequiredDate', val)}
          disabled={readOnly}
        />
      </Box>
    </Box>
  );
}
