import { useEffect, useMemo, useState } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import ItemSelectPopup from '../modules/master-data/ItemLookupModal';
import ServiceSelectPopup from '../modules/master-data/ServiceLookupModal';
import FreightPopup from './FreightPopup';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import TaxSelectPopup from '../modules/master-data/TaxCodeLookup';
import ProjectLookupModal from '../modules/master-data/ProjectLookupModal';
import WarehouseLookupModal from '../modules/master-data/WarehouseLookupModal';
import LookupModal from '../modules/master-data/LookupModal';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCurrencies } from '../../store/slices/currencySlice';
import { getEmployees } from '../../store/slices/commonSlice';

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

export default function ContentTab({ data, setData, rows, setRows, readOnly = false, isEdit = false }) {
  const [documentType, setDocumentType] = useState('item');
  const [currency, setCurrency] = useState('');
  const dispatch = useDispatch();
  const {
    currencies,
    loading: currencyLoading
  } = useSelector(
    (state) => state.currency
  );

  const { employees, employeesLoading } = useSelector((state) => state.common);

  const isService = data.DocType === 'dDocument_Service';

  useEffect(() => {
    if (currencies.length === 0) {
      dispatch(getCurrencies());
    }
  }, [currencies]);

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(getEmployees());
    }
  }, [employees]);

  useEffect(() => {
    const exps = data.DocumentAdditionalExpenses || [];
    if (exps.length) {
      const total = exps.reduce((sum, e) => sum + Number(e.amount ?? e.LineTotal ?? 0), 0);
      setFreightTotal(total);
    }
  }, [data.DocumentAdditionalExpenses]);

  const [openItemPopup, setOpenItemPopup] = useState(false);
  const [openServicePopup, setOpenServicePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [openTaxPopup, setOpenTaxPopup] = useState(false);
  const [selectedTaxRowId, setSelectedTaxRowId] = useState(null);

  const [openProjectPopup, setOpenProjectPopup] = useState(false);
  const [selectedProjectRowId, setSelectedProjectRowId] = useState(null);

  const [openWarehousePopup, setOpenWarehousePopup] = useState(false);
  const [selectedWarehouseRowId, setSelectedWarehouseRowId] = useState(null);

  const [freightPopupOpen, setFreightPopupOpen] = useState(false);
  const [freightTotal, setFreightTotal] = useState(0);

  const handleChange = (
    field,
    value
  ) => {
    setData({
      ...data,
      [field]: value
    });
  };

  useEffect(() => {
    setData(prev => ({
      ...prev,
      DocumentLines: rows
    }));
  }, [rows, setData]);

    const handleOpenItemPopup = (rowId) => {
      setSelectedRowId(rowId);
      if (isService) {
        setOpenServicePopup(true);
      } else {
        setOpenItemPopup(true);
      }
    };

    const handleSelectItem = (item) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedRowId
            ? {
                ...row,
                itemNo: item.ItemCode,
                itemDescription:
                  item.ItemName
              }
            : row
        )
      );
    };

    const handleSelectService = (service) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedRowId
            ? {
                ...row,
                itemNo: service.Code,
                itemDescription: service.Name
              }
            : row
        )
      );
    };
    
    const handleSelectTax = (tax) => {
      setOpenTaxPopup(false);
      setSelectedTaxRowId(null);

      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedTaxRowId
            ? updateRowLocal(row, {
                taxCode: tax.taxCode,
                taxPercentage: tax.taxPercentage
              })
            : row
        )
      );
    };

    const handleSelectProject = (project) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedProjectRowId
            ? {
                ...row,
                project: project.projectCode
              }
            : row
        )
      );

      setOpenProjectPopup(false);
      setSelectedProjectRowId(null);
    };

    const handleSelectWarehouse = (warehouse) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedWarehouseRowId
            ? {
                ...row,
                warehouse: warehouse.warehouseCode
              }
            : row
        )
      );

      setOpenWarehousePopup(false);
      setSelectedWarehouseRowId(null);
    };

  const updateRow = (id, field, value) => {
    const updated = rows.map((row) => {
      if (row.id !== id) return row;

      const newRow = { ...row, [field]: value };

      const qty = parseFloat(newRow.quantity || 0);
      const price = parseFloat(newRow.unitPrice || 0);
      const discount = parseFloat(newRow.discount || 0);
      const taxPct = parseFloat(newRow.taxPercentage || 0);

      const base = qty * price;

      const discountAmt = (base * discount) / 100;

      const afterDiscount = base - discountAmt;

      const taxAmt = (afterDiscount * taxPct) / 100;

      const gross = afterDiscount + taxAmt;

      newRow.lineTotal = afterDiscount.toFixed(2);
      newRow.taxAmount = taxAmt.toFixed(2);
      newRow.grossTotal = gross.toFixed(2);

      return newRow;
    });

    setRows(updated);
  };

  const updateRowLocal = (row, changes) => {
    const newRow = { ...row, ...changes };

    const qty = parseFloat(newRow.quantity || 0);
    const price = parseFloat(newRow.unitPrice || 0);
    const discount = parseFloat(newRow.discount || 0);
    const taxPct = parseFloat(newRow.taxPercentage || 0);

    const base = qty * price;
    const discountAmt = (base * discount) / 100;
    const afterDiscount = base - discountAmt;

    const taxAmt = (afterDiscount * taxPct) / 100;
    const gross = afterDiscount + taxAmt;

    newRow.lineTotal = afterDiscount.toFixed(2);
    newRow.taxAmount = taxAmt.toFixed(2);
    newRow.grossTotal = gross.toFixed(2);

    return newRow;
  };

  useEffect(() => {
    if (readOnly) return;

    const last = rows[rows.length - 1];
    if (!last) return;

    const hasData =
      last.itemNo ||
      last.quantity ||
      last.unitPrice;

    if (hasData) {
      setRows(prev => [
        ...prev,
        createRow(Date.now())
      ]);
    }
  }, [rows, readOnly]);

  const deleteRow = (id) => {
    if (rows.length <= 1) return;

    setRows((prev) =>
      prev.filter((r) => r.id !== id)
    );
  };

  const totalBeforeDiscount = useMemo(() => {
    return rows.reduce(
      (sum, r) =>
        sum + parseFloat(r.lineTotal || 0),
      0
    );
  }, [rows]);

  const totalTax = useMemo(() => {
    return rows.reduce(
      (sum, r) =>
        sum + parseFloat(r.taxAmount || 0),
      0
    );
  }, [rows]);

  const discountAmt =
    (totalBeforeDiscount *
      Number(
        data.DiscountPercent || 0
      )) /
    100;

  const finalTotal =
    totalBeforeDiscount -
    discountAmt +
    totalTax +
    freightTotal +
    (data.Rounding
      ? Number(data.RoundingDiffAmount || 0)
      : 0)

  return (
    <Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 10
        }}
      >

        <Box
          sx={{
            minWidth: {
              xs: '100%',
              sm: 250,
              md: 280
            }
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>
              Item / Service
            </InputLabel>

            <Select
              label="Item / Service"
              value={data.DocType}
              disabled={readOnly || isEdit}
              onChange={(e) => handleChange('DocType', e.target.value)}
            >
              <MenuItem value="dDocument_Items">
                Item
              </MenuItem>

              <MenuItem value="dDocument_Service">
                Service
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* CURRENCY */}

        <Box
          sx={{
            minWidth: {
              xs: '100%',
              sm: 220,
              md: 250
            }
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>
              Currency
            </InputLabel>

            <Select
              label="Currency"
              disabled={readOnly || isEdit || currencyLoading}
              value={data.DocCurrency || ''}
              onChange={(e) =>
                handleChange(
                  'DocCurrency',
                  e.target.value
                )
              }
            >
              {(currencies || []).map((curr) => (
                <MenuItem
                  key={curr.Code}
                  value={curr.Code}
                >
                  {curr.Code} - {curr.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          overflowX: 'auto',
          borderRadius: 2,
          marginBottom: 10
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 2200,
            tableLayout: 'fixed'
          }}
        >

          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  'grey.100'
              }}
            >
              {[
                {
                  label: 'S.No',
                  width: 70
                },
                {
                  label: isService ? 'Service No' : 'Item Code',
                  width: 160
                },
                {
                  label: isService ? 'Service Description' : 'Item Description',
                  width: 240
                },
                {
                  label: 'Qty',
                  width: 100
                },
                {
                  label: 'Price',
                  width: 120
                },
                {
                  label: 'Disc %',
                  width: 120
                },
                {
                  label: 'Total',
                  width: 130
                },
                {
                  label: 'Tax Code',
                  width: 140
                },
                {
                  label: 'Tax %',
                  width: 120
                },
                {
                  label: 'Tax Amount',
                  width: 140
                },
                {
                  label: 'Gross Total',
                  width: 150
                },
                {
                  label: 'Project',
                  width: 160
                },
                {
                  label: 'Warehouse',
                  width: 160
                },
                {
                  label: 'D1',
                  width: 130
                },
                {
                  label: 'D2',
                  width: 130
                },
                {
                  label: 'D3',
                  width: 130
                },
                {
                  label: 'D4',
                  width: 130
                },
                {
                  label: 'D5',
                  width: 130
                },
                {
                  label: 'Action',
                  width: 100
                }
              ].map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    width: col.width,
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                hover
              >
                <TableCell>
                  {index + 1}
                </TableCell>

                {/* ITEM NO */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.itemNo}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'itemNo',
                        e.target.value
                      )
                    }
                    sx={{
                      width: '100%'
                    }}
                    InputProps={{
                      readOnly,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            disabled={readOnly}
                            onClick={() =>
                              handleOpenItemPopup(
                                row.id
                              )
                            }
                          >
                            <SearchIcon
                              sx={{
                                color: '#2196f3',
                                fontSize: 16
                              }}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </TableCell>

                {/* DESCRIPTION */}

                <TableCell>
                  <TextField
                    size="small"
                    disabled
                    value={
                      row.itemDescription
                    }
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* QTY */}

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.quantity}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'quantity',
                        e.target.value
                      )
                    }
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* PRICE */}

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.unitPrice}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'unitPrice',
                        e.target.value
                      )
                    }
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* DISCOUNT */}

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.discount}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'discount',
                        e.target.value
                      )
                    }
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* TOTAL */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.lineTotal}
                    disabled
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* TAX CODE */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.taxCode}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(row.id, 'taxCode', e.target.value)
                    }
                    sx={{ width: '100%' }}
                    InputProps={{
                      readOnly,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            disabled={readOnly}
                            onClick={() => {
                              setSelectedTaxRowId(row.id);
                              setOpenTaxPopup(true);
                            }}
                          >
                            <SearchIcon
                              sx={{ color: '#2196f3', fontSize: 16 }}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </TableCell>

                {/* TAX % */}

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={
                      row.taxPercentage
                    }
                    disabled
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* TAX AMOUNT */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.taxAmount}
                    disabled
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* GROSS TOTAL */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.grossTotal}
                    disabled
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* PROJECT */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.project}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(row.id, 'project', e.target.value)
                    }
                    sx={{ width: '100%' }}
                    InputProps={{
                      readOnly,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            disabled={readOnly}
                            onClick={() => {
                              setSelectedProjectRowId(row.id);
                              setOpenProjectPopup(true);
                            }}
                          >
                            <SearchIcon
                              sx={{ color: '#2196f3', fontSize: 16 }}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </TableCell>

                {/* WAREHOUSE */}

                <TableCell>
                  <TextField
                    size="small"
                    value={row.warehouse}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(row.id, 'warehouse', e.target.value)
                    }
                    sx={{ width: '100%' }}
                    InputProps={{
                      readOnly,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            disabled={readOnly}
                            onClick={() => {
                              setSelectedWarehouseRowId(row.id);
                              setOpenWarehousePopup(true);
                            }}
                          >
                            <SearchIcon
                              sx={{ color: '#2196f3', fontSize: 16 }}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </TableCell>

                {/* DIMENSIONS */}

                {[
                  'dimension1',
                  'dimension2',
                  'dimension3',
                  'dimension4',
                  'dimension5'
                ].map((field) => (
                  <TableCell key={field}>
                    <TextField
                      size="small"
                      value={row[field]}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateRow(
                          row.id,
                          field,
                          e.target.value
                        )
                      }
                      sx={{
                        width: '100%'
                      }}
                    />
                  </TableCell>
                ))}

                {/* DELETE */}

                <TableCell align="center">
                  <IconButton
                    color="error"
                    disabled={readOnly}
                    onClick={() =>
                      deleteRow(row.id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          mt: 3,
          flexWrap: 'wrap'
        }}
      >

      <Box
        sx={{
          flex: {
            xs: '1 1 100%',
            md: '1 1 calc(50% - 16px)'
          }
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            height: '100%',
            borderRadius: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3 }}
          >
            Additional Details
          </Typography>

          <FormControl
            fullWidth
            size="small"
            sx={{ mb: 3 }}
          >
            <InputLabel>
              Owner
            </InputLabel>

            <Select
              label="Owner"
              value={data.SalesPersonCode || ''}
              disabled={readOnly || employeesLoading}
              onChange={(e) =>
                handleChange(
                  'SalesPersonCode',
                  e.target.value
                )
              }
            >
              {(employees || []).map((emp) => (
                <MenuItem
                  key={emp.EmployeeID}
                  value={emp.EmployeeID}
                >
                  {[emp.FirstName, emp.LastName]
                    .filter(Boolean)
                    .join(' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Remark"
            value={data.Comments || ''}
            disabled={readOnly}
            onChange={(e) =>
              handleChange(
                'Comments',
                e.target.value
              )
            }
          />
        </Paper>
      </Box>

        <Paper
          variant="outlined"
          sx={{
            width: 420,
            p: 3
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3 }}
          >
            Total Summary
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography>
              Total Before Discount
            </Typography>

            <Typography>
              {totalBeforeDiscount.toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography>
              Discount %
            </Typography>

            <TextField
              size="small"
              type="number"
              sx={{ width: 120 }}
              disabled={readOnly}
              value={
                data.DiscountPercent || 0
              }
              onChange={(e) =>
                handleChange(
                  'DiscountPercent',
                  Number(e.target.value)
                )
              }
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography>
              Discount Amount
            </Typography>

            <Typography>
              {discountAmt.toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography>
              Freight
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              size="small"
              disabled={readOnly}
              onClick={() =>
                setFreightPopupOpen(true)
              }
              sx={{
                width: 120
              }}
            >
              {freightTotal > 0
                ? freightTotal.toFixed(2)
                : 'Add Freight'}
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography>
              Tax
            </Typography>

            <Typography>
              {totalTax.toFixed(2)}
            </Typography>
          </Box>
          {/* ROUNDING
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Checkbox
                checked={data.Rounding}
                sx={{padding:0}}
                disabled={readOnly}
                onChange={(e) =>
                  handleChange(
                    'Rounding',
                    e.target.checked
                  )
                }
              />

              <Typography>
                Rounding
              </Typography>
            </Box>

            {data.Rounding && (
              <TextField
                size="small"
                type="number"
                sx={{ width: 120 }}
                disabled={readOnly}
                value={data.RoundingDiffAmount}
                onChange={(e) =>
                  handleChange(
                    'RoundingDiffAmount',
                    Number(e.target.value)
                  )
                }
              />
            )}
          </Box>
          */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4
            }}
          >
            <Typography variant="h5">
              Total
            </Typography>

            <Typography variant="h5">
              {finalTotal.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </Box>
      <ItemSelectPopup
        open={openItemPopup}
        onClose={() =>
          setOpenItemPopup(false)
        }
        onSelectItem={handleSelectItem}
      />
      <ServiceSelectPopup
        open={openServicePopup}
        onClose={() => setOpenServicePopup(false)}
        onSelectService={handleSelectService}
      />
      <TaxSelectPopup
        open={openTaxPopup}
        onClose={() => setOpenTaxPopup(false)}
        onSelectTax={handleSelectTax}
      />
      <ProjectLookupModal
        open={openProjectPopup}
        onClose={() => setOpenProjectPopup(false)}
        onSelectProject={handleSelectProject}
      />
      <WarehouseLookupModal
        open={openWarehousePopup}
        onClose={() => setOpenWarehousePopup(false)}
        onSelectWarehouse={handleSelectWarehouse}
      />
      <FreightPopup
        open={freightPopupOpen}
        initialExpenses={data.DocumentAdditionalExpenses}
        onClose={() =>
          setFreightPopupOpen(false)
        }
        onApply={(result) => {
          setFreightTotal(result.total);

          setData(prev => ({
            ...prev,
            DocumentAdditionalExpenses:
              result.expenses
          }));
        }}
      />
    </Box>
  );
}
