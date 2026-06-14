import {
  Box,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useLookup } from '../../context/LookupContext';

export default function GeneralTab({ data, setData, readOnly = false }) {
  const { openLookup } = useLookup();

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleOpenCustomerLookup = () => {
    openLookup({
      type: 'customer',

      onSelect: (customer) => {
        setData(prev => ({
          ...prev,
          CardCode: customer.CardCode,
          CardName: customer.CardName,
          ContactPerson: customer.ContactPerson
        }));
      }
    });
  };

  const formatDate = (isoDate) => isoDate ? isoDate.split('T')[0] : '';
  const statusMap = {
    bost_Open: "Open",
    bost_Closed: "Closed",
    bost_Cancelled: "Cancelled"
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
            value={data.CardCode || ""}
            onChange={(e) => handleChange('CardCode', e.target.value)}
            disabled={readOnly}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={!readOnly && handleOpenCustomerLookup}
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
            value={data.CardName || ""}
            disabled={readOnly}
            onChange={(e) => handleChange('CardName', e.target.value)}
          />

          <TextField
            fullWidth
            label="Contact Person"
            value={data.ContactPerson || ""}
            disabled={readOnly}
            onChange={(e) => handleChange('ContactPerson', e.target.value)}
          />

          <TextField
            fullWidth
            label="Customer Ref No"
            value={data.NumAtCard || ""}
            disabled={readOnly}
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
            value={formatDate(data.DocDate) || ""}
            disabled={readOnly}
            onChange={(e) => !readOnly && handleChange('DocDate', e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Valid Till"
            value={formatDate(data.DocDueDate) || ""}
            disabled={readOnly}
            onChange={(e) => !readOnly && handleChange('DocDueDate', e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Document Date"
            value={formatDate(data.TaxDate) || ""}
            disabled={readOnly}
            onChange={(e) => !readOnly && handleChange('TaxDate', e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            fullWidth
            label="Status"
            value={statusMap[data.DocumentStatus] || "Open"}
            disabled
          />
        </Box>
      </Box>
    </>
  );
}