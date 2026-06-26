import { useState } from 'react';

import {
  Box,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CustomerSelectPopup from '../modules/master-data/CustomerLookup';

export default function GeneralTab({ data, setData }) {
  const today = new Date()
    .toISOString()
    .split('T')[0];

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  // ================= STATES ================= //

  const [openCustomerPopup, setOpenCustomerPopup] =
    useState(false);

  const handleSelectCustomer = (customerData) => {
      setData({
          ...data,
          CardCode: customerData.CardCode,
          CardName: customerData.CardName,
          ContactPerson: customerData.ContactPerson
      });
      setOpenCustomerPopup(false);
  };

  return (
    <>
      {/* ================= MAIN LAYOUT ================= */}

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap'
        }}
      >
        {/* ================= LEFT SIDE ================= */}

        <Box
          sx={{
            flex: 1,
            minWidth: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {/* CUSTOMER */}

          <TextField
            fullWidth
            label="Customer"
            value={data.CardCode}
            onChange={(e) => handleChange('CardCode', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setOpenCustomerPopup(true)
                    }
                  >
                    <PersonSearchIcon sx={{color:'#2196f3'}}/>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Name"
            value={data.CardName}
            onChange={(e) => handleChange('CardName', e.target.value)}
          />

          <TextField
            fullWidth
            label="Contact Person"
            value={data.ContactPerson}
            onChange={(e) => handleChange('ContactPerson', e.target.value)}
          />

          <TextField
            fullWidth
            label="Customer Ref No"
            value={data.NumAtCard}
            onChange={(e) => handleChange('NumAtCard', e.target.value)}
          />

          {/* <TextField
            fullWidth
            label="Document Number"
            value={docNumber}
            onChange={(e) =>
              setDocNumber(e.target.value)
            }
          /> */}
        </Box>

        {/* ================= RIGHT SIDE ================= */}

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
            type="date"
            label="Posting Date"
            value={data.DocDate}
            onChange={(e) => handleChange('DocDate', e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Valid Till"
            value={data.DocDueDate}
            onChange={(e) => handleChange('DocDueDate', e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Document Date"
            value={data.TaxDate}
            onChange={(e) => handleChange('TaxDate', e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            fullWidth
            label="Status"
            value="Open"
            disabled
          />
        </Box>
      </Box>

      {/* ================= POPUP ================= */}

      <CustomerSelectPopup
        open={openCustomerPopup}
        onClose={() =>
          setOpenCustomerPopup(false)
        }
        onSelectCustomer={handleSelectCustomer}
      />
    </>
  );
}