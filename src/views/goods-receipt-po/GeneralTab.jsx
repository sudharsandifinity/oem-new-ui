import { useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SearchIcon from '@mui/icons-material/Search';
import { useLookup } from '../../context/LookupContext';
import VendorSelectModal from './VendorSelectModal';

const today = new Date().toISOString().split('T')[0];

export default function GRPOGeneralTab({ data, setData, readOnly = false }) {
  const { openLookup } = useLookup();
  const [vendorModalOpen, setVendorModalOpen] = useState(false);

  const handleChange = (field, value) => {
    if (!readOnly) setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVendorChoose = (vendor) => {
    setVendorModalOpen(false);
    setData((prev) => ({ ...prev, VendorCode: vendor.CardCode, VendorName: vendor.CardName ?? '' }));
  };

  const handleProjectLookup = () => {
    openLookup({
      type: 'project',
      onSelect: (project) => {
        setData((prev) => ({ ...prev, ProjectCode: project.Code, ProjectName: project.Name }));
      }
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Vendor Code"
            value={data?.VendorCode || ''}
            onChange={(e) => handleChange('VendorCode', e.target.value)}
            disabled={readOnly}
            InputProps={
              !readOnly
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setVendorModalOpen(true)}>
                          <SearchIcon sx={{ color: '#2196f3' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                : undefined
            }
          />
          <TextField fullWidth label="Vendor Name" value={data?.VendorName || ''} disabled />
          <TextField
            fullWidth
            label="Contact Person"
            value={data?.ContactPerson || ''}
            onChange={(e) => handleChange('ContactPerson', e.target.value)}
            disabled={readOnly}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            type="date"
            label="Posting Date"
            value={data?.DocDate || today}
            disabled
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Project Code"
            value={data?.ProjectCode || ''}
            disabled={readOnly}
            InputProps={
              !readOnly
                ? {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleProjectLookup}>
                          <AccountTreeIcon sx={{ color: '#2196f3' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                : undefined
            }
          />
          <TextField fullWidth label="Project Name" value={data?.ProjectName || ''} disabled />
        </Box>
      </Box>

      <VendorSelectModal open={vendorModalOpen} onClose={() => setVendorModalOpen(false)} onChoose={handleVendorChoose} />
    </>
  );
}
