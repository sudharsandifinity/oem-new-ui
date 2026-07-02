import { useState } from 'react';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AppDatePicker from 'ui-component/AppDatePicker';
import RequestorSelectModal from '../material-request/RequestorSelectModal';

const today = new Date().toISOString().split('T')[0];

export default function PRGeneralTab({ data, setData, readOnly = false }) {
  const [requestorModalOpen, setRequestorModalOpen] = useState(false);

  const handleChange = (field, value) => {
    if (!readOnly) setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequestorTypeChange = (value) => {
    if (readOnly) return;
    setData((prev) => ({ ...prev, RequestorTypeLabel: value, ReqCode: '', RequestorName: '', DeptId: '', Department: '' }));
  };

  const handleRequestorSelect = ({ code, name, deptId = '', deptName = '' }) => {
    setData((prev) => ({ ...prev, ReqCode: code, RequestorName: name, DeptId: deptId, Department: deptName }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 160 }} size="medium" disabled={readOnly}>
            <InputLabel>Requestor Type</InputLabel>
            <Select label="Requestor Type" value={data?.RequestorTypeLabel || 'User'} onChange={(e) => handleRequestorTypeChange(e.target.value)}>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Requestor Code"
            value={data?.ReqCode || ''}
            disabled={readOnly}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disabled={readOnly} onClick={() => setRequestorModalOpen(true)}>
                    <PersonSearchIcon sx={{ color: readOnly ? 'text.disabled' : '#2196f3' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        <TextField fullWidth label="Requestor Name" value={data?.RequestorName || ''} disabled />

        <TextField fullWidth label="Department" value={data?.Department || ''} disabled />
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

      <RequestorSelectModal
        open={requestorModalOpen}
        onClose={() => setRequestorModalOpen(false)}
        onSelect={handleRequestorSelect}
        requestorType={data?.RequestorTypeLabel || 'User'}
      />
    </Box>
  );
}
