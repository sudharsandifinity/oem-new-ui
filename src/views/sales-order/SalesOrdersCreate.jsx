import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSalesOrder, resetSalesOrderState } from '../../store/slices/salesOrderSlice';

import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// icons
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import GeneralTab from './GeneralTab';
import ContentTab from './ContentTab';
import AttachmentTab from './AttachmentTab';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SalesOrdersCreate() {
  const dispatch = useDispatch();
  const { loading, error, saveSuccess } = useSelector(
    (state) => state.salesOrder
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Sales Order created successfully'
      });
    }

    if (error) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: error
      });
    }
  }, [saveSuccess, error]);

  useEffect(() => {
    return () => {
      dispatch(resetSalesOrderState());
    };
  }, [dispatch]);

  const createRow = (id) => ({
    id,
    itemNo: '',
    itemDescription: '',
    quantity: '',
    unitPrice: '',
    discount: '',
    lineTotal: '',
    taxCode: '',
    taxPercentage: '',
    taxAmount: '',
    grossTotal: '',
    project: '',
    warehouse: '',
    dimension1: '',
    dimension2: '',
    dimension3: '',
    dimension4: '',
    dimension5: ''
  });

  const [documentLines, setDocumentLines] = useState([
    createRow(1),
    createRow(2),
  ]);

  const createAttachmentRow = (id) => ({
    id,
    file: null,
    fileName: ''
  });
    

  const initialState = () => ({
    CardCode: '',
    CardName: '',
    ContactPerson: '',
    NumAtCard: '',

    DocDate: today,
    DocDueDate: today,
    TaxDate: today,

    Attachments2_Lines: [createAttachmentRow(1)],

    DocType: 'dDocument_Items',
    DocCurrency: '',
    Comments: '',
    SalesPersonCode: '',
    DiscountPercent: 0,
    Rounding: false,
    RoundingDiffAmount: 0,

    DocumentLines: [],
    DocumentAdditionalExpenses: []
  });
  const today = new Date().toISOString().split('T')[0];
  const [salesOrder, setSalesOrder] = useState(initialState());
  

  const [tabValue, setTabValue] =
    useState(0);

  const handleTabChange = (
    event,
    newValue
  ) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    const isService = salesOrder.DocType === 'dDocument_Service';

    const payload = {
      DocType: salesOrder.DocType,
      CardCode: salesOrder.CardCode,
      CardName: salesOrder.CardName,
      NumAtCard: salesOrder.NumAtCard,
      DocDate: salesOrder.DocDate,
      DocDueDate: salesOrder.DocDueDate,
      DocCurrency: salesOrder.DocCurrency,
      Comments: salesOrder.Comments,
      ContactPersonCode: salesOrder.ContactPersonCode,
      RequriedDate: salesOrder.DocDueDate,
      DiscountPercent: Number(salesOrder.DiscountPercent) || 0,
      Rounding:
        salesOrder.Rounding
          ? 'tYES'
          : 'tNO',
      RoundingDiffAmount: salesOrder.RoundingDiffAmount,
      DocumentLines: documentLines
        .filter(
          row =>
            row.itemNo &&
            Number(row.quantity) > 0
        )
        .map((row, index) => ({
          LineNum: index,
          ...(isService
            ? { AccountCode: row.itemNo }
            : { ItemCode: row.itemNo }),
          ItemDescription:
            row.itemDescription,
          Quantity: Number(row.quantity),
          Price: Number(row.unitPrice),
          DiscountPercent: Number(row.discount) || 0,
          WarehouseCode:
            row.warehouse || null,
          ProjectCode:
            row.project || null,
          VatGroup:
            row.taxCode || null
        })),
        DocumentAdditionalExpenses:
        (salesOrder.DocumentAdditionalExpenses || [])
          .map(exp => ({
            ExpenseCode: Number(exp.freightCode),
            Remarks: exp.remark || '',
            VatGroup: exp.taxGroup || null,
            LineTotal: Number(exp.amount || 0)
        }))
    };

    const formData = new FormData();

    Object.entries(payload).forEach(
      ([key, value]) => {
        if (
          key === 'DocumentLines' ||
          key === 'DocumentAdditionalExpenses'
        ) {
          formData.append(
            key,
            JSON.stringify(value)
          );
        } else {
          formData.append(
            key,
            value ?? ''
          );
        }
      }
    );

    (salesOrder.Attachments2_Lines || []).forEach(
      (attachment) => {
        if (attachment.file) {
          formData.append(
            'Attachments2_Lines',
            attachment.file
          );
        }
      }
    );

    console.log(
      'Attachments:',
      salesOrder.Attachments2_Lines
    );
    console.log('entire',[...formData.entries()]);

    try {
      const resultAction = await dispatch(
        createSalesOrder(formData)
      );

      if (createSalesOrder.fulfilled.match(resultAction)) {
        setSalesOrder(initialState());

        setDocumentLines([
          createRow(1),
          createRow(2)
        ]);

        setTabValue(0);
      } else {
        console.error(
          'Create failed:',
          resultAction.payload
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>

      <MainCard
        content={false}
        sx={{ mb: 3 }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: {
              xs: 'flex-start',
              md: 'center'
            },
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            gap: 2
          }}
        >
          {/* TITLE */}

          <Typography variant="h3">
            Sales Orders
          </Typography>

          {/* BREADCRUMB */}

          <Breadcrumbs
            separator={
              <NavigateNextIcon fontSize="small" />
            }
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <HomeIcon
                color="secondary"
                sx={{
                  fontSize: 18
                }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.primary"
            >
              Sales Orders
            </Typography>

            <Typography
              variant="body2"
              color="secondary"
              fontWeight={600}
            >
              Create
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            pt: 1
          }}
        >
          <Tabs
            value={tabValue}
            onChange={
              handleTabChange
            }
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" />

            <Tab label="Contents" />

            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <GeneralTab
              data={salesOrder}
              setData={setSalesOrder}
            />
          )}

          {tabValue === 1 && (
            <ContentTab
              data={salesOrder}
              setData={setSalesOrder}
              rows={documentLines}
              setRows={setDocumentLines}
            />
          )}

          {tabValue === 2 && (
            <AttachmentTab 
              data={salesOrder}
              setData={setSalesOrder}
            />
          )}

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent:
                'flex-end',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              {loading ? 'Saving...' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </MainCard>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false
          }))
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="standard"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}