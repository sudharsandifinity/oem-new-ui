import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { useNavigate, useLocation } from 'react-router';
import { mapApiToForm, mapApiToRows, mapApiToSO, mapApiToSORows } from './ARInvoiceHelpers';
import { createARInvoice, resetARInvoiceState } from '../../store/slices/ARInvoiceSlice';

export default function SalesInvoicesCreate() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
const location = useLocation();


  const { loading, error, saveSuccess } = useSelector(
    (state) => state.ARInvoice
  );
  useEffect(() => {
    if (!location?.state?.salesQuotation) return;
    setSalesInvoice(mapApiToSO(location?.state?.salesQuotation));
    setDocumentLines([...mapApiToSORows(location.state.salesQuotation), { id: Date.now(), itemNo: '', itemDescription: '', quantity: '', unitPrice: '', discount: '', lineTotal: '', taxCode: '', taxPercentage: '', taxAmount: '', grossTotal: '', project: '', warehouse: '', dimension1: '', dimension2: '', dimension3: '', dimension4: '', dimension5: '' }]);
  }, [location?.state]);
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
        message: 'Sales Invoice created successfully'
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
      dispatch(resetARInvoiceState());
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
  const [salesInvoice, setSalesInvoice] = useState(initialState());
  

  const [tabValue, setTabValue] =
    useState(0);

  const handleTabChange = (
    event,
    newValue
  ) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    const isService = salesInvoice.DocType === 'dDocument_Service';

    const payload = {
      DocType: salesInvoice.DocType,
      CardCode: salesInvoice.CardCode,
      CardName: salesInvoice.CardName,
      NumAtCard: salesInvoice.NumAtCard,
      DocDate: salesInvoice.DocDate,
      DocDueDate: salesInvoice.DocDueDate,
      DocCurrency: salesInvoice.DocCurrency,
      Comments: salesInvoice.Comments,
      ContactPersonCode: salesInvoice.ContactPersonCode,
      RequriedDate: salesInvoice.DocDueDate,
      DiscountPercent: Number(salesInvoice.DiscountPercent) || 0,
      TaxDate: salesInvoice.TaxDate,
      Rounding:
        salesInvoice.Rounding
          ? 'tYES'
          : 'tNO',
      RoundingDiffAmount: salesInvoice.RoundingDiffAmount,
       
          DiscountPercent: salesInvoice.DiscountPercent || 0,
          TotalDiscount: salesInvoice.discountAmt || 0,
          DocumentsOwner:salesInvoice.SalesPersonCode||'',
      DocumentLines: documentLines
        .filter(
          row =>
            row.itemNo &&
            Number(row.quantity) > 0
        )
        .map((row, index) =>
          isService
            ? {
                LineNum: index,
                AccountCode: row.itemNo,
                ItemDescription: row.itemDescription,
                Quantity: Number(row.quantity),
                UnitPrice: Number(row.unitPrice),
                DiscountPercent: Number(row.discount) || 0,
                ProjectCode: row.project || null,
                VatGroup: row.taxCode || null
              }
            : {
                LineNum: index,
                ItemCode: row.itemNo,
                ItemDescription: row.itemDescription,
                Quantity: Number(row.quantity),
                UnitPrice: Number(row.unitPrice),
                DiscountPercent: Number(row.discount) || 0,
                WarehouseCode: row.warehouse || null,
                ProjectCode: row.project || null,
                VatGroup: row.taxCode || null
              }
        ),
        DocumentAdditionalExpenses:
        (salesInvoice.DocumentAdditionalExpenses || [])
          .map(exp => ({
            ExpenseCode: Number(exp.freightCode),
            Remarks: exp.remark || '',
            VatGroup: exp.taxGroup || null,
            LineTotal: Number(exp.amount || 0),

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

    (salesInvoice.Attachments2_Lines || []).forEach(
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
      salesInvoice.Attachments2_Lines
    );
    console.log('entire',[...formData.entries()]);
console.log("salescreate",formData)
    try {
      const resultAction = await dispatch(
        createARInvoice(formData)
      );

      if (createARInvoice.fulfilled.match(resultAction)) {
        setSalesInvoice(initialState());

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
            Sales Invoice
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
              onClick={() => navigate('/')}
            >
              <HomeIcon
                color="secondary"
                sx={{
                  fontSize: 18, cursor: 'pointer' 
                }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.primary"
            >
              Sales Invoice
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
              data={salesInvoice}
              setData={setSalesInvoice}
            />
          )}

          {tabValue === 1 && (
            <ContentTab
              data={salesInvoice}
              setData={setSalesInvoice}
              rows={documentLines}
              setRows={setDocumentLines}
            />
          )}

          {tabValue === 2 && (
            <AttachmentTab 
              data={salesInvoice}
              setData={setSalesInvoice}
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
              onClick={() => navigate(-1)}
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