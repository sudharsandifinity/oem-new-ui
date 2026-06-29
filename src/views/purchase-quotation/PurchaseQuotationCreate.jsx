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
import { createPurchaseQuotation, resetPurchaseQuotationState } from '../../store/slices/purchaseQuotationSlice';
import { useNavigate } from 'react-router';

export default function PurchaseQuotationsCreate() {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { loading, error, saveSuccess } = useSelector(
    (state) => state.PurchaseQuotation
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
        message: 'Purchase Quotation created successfully'
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
      dispatch(resetPurchaseQuotationState());
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
    purchasePersonCode: '',
    DiscountPercent: 0,
    Rounding: false,
    RoundingDiffAmount: 0,

    DocumentLines: [],
    DocumentAdditionalExpenses: []
  });
  const today = new Date().toISOString().split('T')[0];
  const [purchaseQuotation, setPurchaseQuotation] = useState(initialState());
  

  const [tabValue, setTabValue] =
    useState(0);

  const handleTabChange = (
    event,
    newValue
  ) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    const payload = {
      DocType: purchaseQuotation.DocType,
      CardCode: purchaseQuotation.CardCode,
      CardName: purchaseQuotation.CardName,
      NumAtCard: purchaseQuotation.NumAtCard,
      DocDate: purchaseQuotation.DocDate,
      DocDueDate: purchaseQuotation.DocDueDate,
      DocCurrency: purchaseQuotation.DocCurrency,
      Comments: purchaseQuotation.Comments,
      ContactPersonCode: purchaseQuotation.ContactPersonCode,
      RequriedDate: purchaseQuotation.DocDueDate,
      Rounding:
        purchaseQuotation.Rounding
          ? 'tYES'
          : 'tNO',
      RoundingDiffAmount: purchaseQuotation.RoundingDiffAmount,
      DocumentLines: documentLines
        .filter(
          row =>
            row.itemNo &&
            Number(row.quantity) > 0
        )
        .map((row, index) => ({
          LineNum: index,
          ItemCode: row.itemNo,
          ItemDescription:
            row.itemDescription,
          Quantity: Number(row.quantity),
          Price: Number(row.unitPrice),
          WarehouseCode:
            row.warehouse || null,
          ProjectCode:
            row.project || null,
          VatGroup:
            row.taxCode || null
        })),
        DocumentAdditionalExpenses:
        (purchaseQuotation.DocumentAdditionalExpenses || [])
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

    (purchaseQuotation.Attachments2_Lines || []).forEach(
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
      purchaseQuotation.Attachments2_Lines
    );
    console.log('entire',[...formData.entries()]);

    try {
      const resultAction = await dispatch(
        createPurchaseQuotation(formData)
      );

      if (createPurchaseQuotation.fulfilled.match(resultAction)) {
        setPurchaseQuotation(initialState());

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
            Purchase Quotations
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
              Purchase Quotations
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
              data={purchaseQuotation}
              setData={setPurchaseQuotation}
            />
          )}

          {tabValue === 1 && (
            <ContentTab
              data={purchaseQuotation}
              setData={setPurchaseQuotation}
              rows={documentLines}
              setRows={setDocumentLines}
            />
          )}

          {tabValue === 2 && (
            <AttachmentTab 
              data={purchaseQuotation}
              setData={setPurchaseQuotation}
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