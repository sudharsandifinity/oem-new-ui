import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Tab,
  Tabs
} from '@mui/material';

import GeneralTab from './GeneralTab';
import ContentTab from './ContentTab';
import AttachmentTab from './AttachmentTab';

export default function SalesOrderForm({
  mode = 'create', // create | edit | view
  salesOrder,
  setSalesOrder,
  documentLines,
  setDocumentLines,
  loading,
  onSubmit,
  onCancel
}) {
  const [tabValue, setTabValue] = useState(0);

  const isView = mode === 'view';

  return (
    <>
      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="General" />
          <Tab label="Contents" />
          <Tab label="Attachments" />
        </Tabs>
      </Box>

      {/* BODY */}
      <Box sx={{ p: 3 }}>
        {tabValue === 0 && (
          <GeneralTab
            data={salesOrder}
            setData={setSalesOrder}
            disabled={isView}
          />
        )}

        {tabValue === 1 && (
          <ContentTab
            data={salesOrder}
            setData={setSalesOrder}
            rows={documentLines}
            setRows={setDocumentLines}
            disabled={isView}
          />
        )}

        {tabValue === 2 && (
          <AttachmentTab
            data={salesOrder}
            setData={setSalesOrder}
            disabled={isView}
          />
        )}

        <Divider sx={{ my: 4 }} />

        {/* ACTIONS */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
          >
            Cancel
          </Button>

          {mode !== 'view' && (
            <Button
              variant="contained"
              color="secondary"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Submit'}
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}