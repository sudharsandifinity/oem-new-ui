import { useState } from 'react';

import { Box, IconButton, InputAdornment, TextField } from '@mui/material';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CustomerSelectPopup from '../modules/master-data/CustomerLookup';
import AppDatePicker from 'ui-component/AppDatePicker';
import VendorSelectPopup from '../modules/master-data/VendorLookup';

export default function GeneralTab({ data, setData, readOnly = false }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const [openCustomerPopup, setOpenCustomerPopup] = useState(false);

  const handleSelectVendor = (customerData) => {
    setData({
      ...data,
      VendorCode: customerData.VendorCode,
      VendorName: customerData.VendorName,
      ContactPerson: customerData.ContactPerson
    });
    setOpenCustomerPopup(false);
  };

  return (
    <>

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap'
        }}
      >

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
            label="Vendor"
            value={data.VendorCode}
            disabled={readOnly}
            onChange={(e) => handleChange('VendorCode', e.target.value)}
            InputProps={{
              readOnly,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disabled={readOnly} onClick={() => setOpenCustomerPopup(true)}>
                    <PersonSearchIcon sx={{ color: readOnly ? 'text.disabled' : '#2196f3' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Name"
            value={data.VendorName}
            disabled={readOnly}
            onChange={(e) => handleChange('VendorName', e.target.value)}
          />

          <TextField
            fullWidth
            label="Contact Person"
            value={data.ContactPerson}
            disabled={readOnly}
            onChange={(e) => handleChange('ContactPerson', e.target.value)}
          />

          <TextField
            fullWidth
            label="Vendor Ref. No."
            value={data.NumAtVendor}
            disabled={readOnly}
            onChange={(e) => handleChange('NumAtCard', e.target.value)}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <AppDatePicker label="Posting Date" value={data.DocDate} disabled={readOnly} onChange={(val) => handleChange('DocDate', val)} />

          <AppDatePicker label="Valid Till" value={data.DocDueDate} disabled={readOnly} onChange={(val) => handleChange('DocDueDate', val)} />

          <AppDatePicker label="Document Date" value={data.TaxDate} disabled={readOnly} onChange={(val) => handleChange('TaxDate', val)} />
          <AppDatePicker label="Required Date" value={data.ReqDate} disabled={readOnly} onChange={(val) => handleChange('ReqDate', val)} />


          <TextField fullWidth label="Status" value={data.StatusLabel || 'Open'} disabled />
        </Box>
      </Box>
      <VendorSelectPopup open={openCustomerPopup} onClose={() => setOpenCustomerPopup(false)} onSelectVendor={handleSelectVendor} />
    </>
  );
}
