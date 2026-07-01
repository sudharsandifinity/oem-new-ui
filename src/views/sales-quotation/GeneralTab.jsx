import { useEffect, useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AppDatePicker from 'ui-component/AppDatePicker';
import CustomerSelectPopup from '../modules/master-data/CustomerLookup';

import { useLookup } from '../../context/LookupContext';
import { useSelector } from 'react-redux';

const today = new Date().toISOString().split('T')[0];

export default function SalesQuoatationGeneralTab({ data, setData, readOnly = false }) {
  const { openLookup } = useLookup();
  const [openCustomerPopup, setOpenCustomerPopup] = useState(false);
const { customers } = useSelector((state) => state.customer);

  const handleSelectCustomer = (customerData) => {
    setData({
      ...data,
      CardCode: customerData.CardCode,
      CardName: customerData.CardName,
      ContactPerson: customerData.ContactPerson
    });
    setOpenCustomerPopup(false);
  };

  const handleChange = (field, value) => {
    if (!readOnly) setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChoose = (Customer) => {
    setCustomerModalOpen(false);
    setData((prev) => ({ ...prev, CustomerCode: Customer.CardCode, CustomerName: Customer.CardName ?? '' }));
  };

  const handleProjectLookup = () => {
    openLookup({
      type: 'project',
      onSelect: (project) => {
        setData((prev) => ({ ...prev, ProjectCode: project.Code, ProjectName: project.Name }));
      }
    });
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
    <>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Customer"
            value={data?.CardCode || ''}
            onChange={(e) => handleChange('CardCode', e.target.value)}
            disabled={readOnly}
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
            value={data?.CardName || ''}
            onChange={(e) => handleChange('CardName', e.target.value)}
            disabled={readOnly}
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
            label="Customer Ref.No"
            value={data?.NumAtCard || ''}
            onChange={(e) => handleChange('NumAtCard', e.target.value)}
            disabled={readOnly}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AppDatePicker label="Posting Date" value={data.DocDate} disabled={readOnly} onChange={(val) => handleChange('DocDate', val)} />

          <AppDatePicker
            label="Delivery Date"
            value={data.DocDueDate}
            disabled={readOnly}
            onChange={(val) => handleChange('DocDueDate', val)}
          />

          <AppDatePicker label="Document Date" value={data.TaxDate} disabled={readOnly} onChange={(val) => handleChange('TaxDate', val)} />

          <TextField fullWidth label="Status" value={data.StatusLabel || 'Open'} disabled />
        </Box>
      </Box>

            <CustomerSelectPopup open={openCustomerPopup} onClose={() => setOpenCustomerPopup(false)} onSelectCustomer={handleSelectCustomer} />

    </>
  );
}
