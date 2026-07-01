import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AppDatePicker from 'ui-component/AppDatePicker';
import RequestorSelectModal from '../material-request/RequestorSelectModal';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';


const today = new Date().toISOString().split('T')[0];

export default function PRGeneralTab({ data, setData, readOnly = false }) {
    const {  employees, employeesLoading } = useSelector((s) => s.common);
    const [requestorModalOpen, setRequestorModalOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
const { customers } = useSelector((state) => state.customer);
  
  const handleChange = (field, value) => {
    if (!readOnly) setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequestorSelect = ({ code, name, deptId = '', deptName = '' }) => {
    setData((prev) => ({ ...prev, ReqCode: code, RequestorName: name, DeptId: deptId, Department: deptName }));
  };
  useEffect(() => {
    if (!data?.CardCode || !customers?.length) return;
  
    const customer = customers.find((c) => c.CardCode === data.CardCode);
  
    if (customer) {
      setData((prev) => ({
        ...prev,
        CardName: prev.CardName || customer.CardName,
        ContactPerson: customer.ContactPerson || ''
      }));
    }
  }, [data?.CardCode, customers]);
  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }} disabled={readOnly}>
            <InputLabel>Requestor Type</InputLabel>
            <Select
                    label="Requestor Type"
                    value={data?.RequestorType || '12'}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        RequestorType: e.target.value,
                        ReqCode: '',
                        RequestorName: '',
                        Department: ''
                      }))
                    }
                  >
                    <MenuItem value={12}>User</MenuItem>
                    <MenuItem value={171}>Employee</MenuItem>
                  </Select>
          </FormControl>

          <TextField                   size="small"
 label="Requestor Code" value={data?.ReqCode || ''}
                  disabled={readOnly}
                  sx={{ flex: 1 }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" disabled={readOnly} onClick={() => setRequestorModalOpen(true)}>
                          <PersonSearchIcon sx={{ fontSize: 18, color: readOnly ? 'text.disabled' : '#2196f3' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}/>
        </Box>

        <TextField fullWidth label="Requestor Name" value={data?.RequestorName || ''} disabled={readOnly} />

        <TextField fullWidth label="Department" value={data?.Department || ''} disabled={readOnly} />

        <TextField fullWidth label="Status" value={data.StatusLabel || 'Open'} disabled />
      </Box>

      <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AppDatePicker label="Posting Date" value={data.DocDate} disabled={readOnly} onChange={(val) => handleChange('DocDate', val)} />
        
                  <AppDatePicker label="Valid Till" value={data.DocDueDate} disabled={readOnly} onChange={(val) => handleChange('DocDueDate', val)} />
        
                  <AppDatePicker label="Document Date" value={data.TaxDate} disabled={readOnly} onChange={(val) => handleChange('TaxDate', val)} />
                  <AppDatePicker label="Required Date" value={data.ReqDate} disabled={readOnly} onChange={(val) => handleChange('ReqDate', val)} />
        
        
      </Box>
       <RequestorSelectModal
              open={requestorModalOpen}
              onClose={() => setRequestorModalOpen(false)}
              onSelect={handleRequestorSelect}
              requestorType={data?.RequestorType || 'User'}
            />
    </Box>
  );
}
