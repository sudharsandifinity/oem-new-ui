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
          <FormControl fullWidth size="medium" disabled={readOnly}>
            <InputLabel>Requestor Type</InputLabel>
            <Select
              label="Requestor Type"
              value={data?.RequestorTypeLabel || ''}
              onChange={(e) => handleChange('RequestorTypeLabel', e.target.value)}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="">—</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Requestor Code"
            value={data?.ReqCode || ''}
            disabled={readOnly}
            onChange={(e) => handleChange('ReqCode', e.target.value)}
          />
        </Box>

        <TextField
          fullWidth
          label="Requestor Name"
          value={data?.RequestorName || ''}
          disabled={readOnly}
          onChange={(e) => handleChange('RequestorName', e.target.value)}
        />

        <TextField
          fullWidth
          label="Department"
          value={data?.Department || ''}
          disabled={readOnly}
          onChange={(e) => handleChange('Department', e.target.value)}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AppDatePicker
          label="Posting Date"
          value={data?.DocDate || today}
          disabled={readOnly}
          onChange={(val) => handleChange('DocDate', val)}
        />

        <AppDatePicker
          label="Document Date"
          value={data?.TaxDate || today}
          onChange={(val) => handleChange('TaxDate', val)}
          disabled={readOnly}
        />

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
