import { useEffect, useMemo, useState } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
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
import FreightPopup from './FreightPopup';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCurrencies } from '../../store/slices/currencySlice';
import { useLookup } from '../../context/LookupContext';

// ==============================|| HELPERS ||============================== //

const createRow = (id) => ({
  id,
  ItemCode: '',
  ItemDescription: '',
  Quantity: '',
  UnitPrice: '',
  DiscountPercent: '',
  LineTotal: '',
  VatGroup: '',
  TaxPercentagePerRow: '',
  TaxTotal: '',
  GrossTotal: '',
  ProjectCode: '',
  WarehouseCode: '',
  UoMCode: '',
  UoMName: '',
  AvailableUOMs: [],
  dimension1: '',
  dimension2: '',
  dimension3: '',
  dimension4: '',
  dimension5: ''
});

// ==============================|| COMPONENT ||============================== //

export default function ContentTab({data, setData, rows, setRows, readOnly = false, disableRounding = false}) {
  console.log('rowss', rows);
  
  const dispatch = useDispatch();
  const { openLookup } = useLookup();

  const {
    currencies,
    loading: currencyLoading
  } = useSelector(
    (state) => state.currency
  );

  useEffect(() => {
    if (currencies.length === 0) {
      dispatch(getCurrencies());
    }
  }, [currencies]);

  const [freightPopupOpen, setFreightPopupOpen] = useState(false);
  const [freightTotal, setFreightTotal] = useState(() =>
    (data?.DocumentAdditionalExpenses || []).reduce(
      (sum, exp) => sum + parseFloat(exp.grossAmount ?? exp.LineGross ?? exp.LineTotal ?? 0), 0
    )
  );

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

    // ================= OPEN ITEM POPUP ================= //

    const handleOpenItemPopup = (rowId) => {
      openLookup({
        type: 'item',
          onSelect: (item) => {
            const availableUOMs =
              item?.OEM?.UOM || [];

            const defaultUOM =
              availableUOMs[0];

            setRows((prev) =>
              prev.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      ItemCode: item.ItemCode,
                      ItemDescription: item.ItemName,

                      AvailableUOMs:
                        availableUOMs,

                      UoMCode:
                        defaultUOM?.Code || '',

                      UoMEntry:
                        defaultUOM?.AbsEntry ?? '',

                      UoMName:
                        defaultUOM?.Name || ''
                    }
                  : row
              )
            );
          }
      });
    };

    const handleOpenTaxLookup = (rowId) => {
      openLookup({
        type: 'tax',

        onSelect: (tax) => {
          setRows((prev) =>
            prev.map((row) =>
              row.id === rowId
                ? updateRowLocal(row, {
                    VatGroup: tax.Code,
                    TaxPercentagePerRow: tax.VatGroups_Lines[0].Rate || tax.TaxRate || 0
                  })
                : row
            )
          );
        }
      });
    };

    const handleOpenProjectLookup = (rowId) => {
      openLookup({
        type: 'project',

        onSelect: (ProjectCode) => {
          setRows((prev) =>
            prev.map((row) =>
              row.id === rowId
                ? {
                    ...row,
                    ProjectCode:
                      ProjectCode.Code
                  }
                : row
            )
          );
        }
      });
    };

    const handleOpenWarehouseLookup = (
      rowId
    ) => {
      openLookup({
        type: 'warehouse',

        onSelect: (WarehouseCode) => {
          setRows((prev) =>
            prev.map((row) =>
              row.id === rowId
                ? {
                    ...row,
                    WarehouseCode:
                      WarehouseCode.WarehouseCode
                  }
                : row
            )
          );
        }
      });
    };

  // ==============================|| ROW CALCULATION ||============================== //

  const calcRowTotals = (row, docDiscountPct) => {
    const qty = parseFloat(row.Quantity || 0);
    const UnitPrice = parseFloat(row.UnitPrice || 0);
    const rowDiscountPct = parseFloat(row.DiscountPercent || 0);
    const taxPct = parseFloat(row.TaxPercentagePerRow || 0);

    const base = qty * UnitPrice;
    const afterRowDiscount = base - (base * rowDiscountPct) / 100;
    // SAP applies doc discount to the line before computing tax
    const afterDocDiscount = afterRowDiscount * (1 - docDiscountPct / 100);
    const taxAmt = (afterDocDiscount * taxPct) / 100;

    return {
      ...row,
      LineTotal: afterRowDiscount.toFixed(2),
      TaxTotal: taxAmt.toFixed(2),
      GrossTotal: (afterRowDiscount + taxAmt).toFixed(2)
    };
  };

  const updateRow = (id, field, value) => {
    const docDiscountPct = parseFloat(data.DiscountPercent || 0);
    const updated = rows.map((row) => {
      if (row.id !== id) return row;
      return calcRowTotals({ ...row, [field]: value }, docDiscountPct);
    });
    setRows(updated);
  };

  const updateRowLocal = (row, changes) => {
    const docDiscountPct = parseFloat(data.DiscountPercent || 0);
    return calcRowTotals({ ...row, ...changes }, docDiscountPct);
  };

  // Recalculate tax on all rows whenever the document discount changes
  useEffect(() => {
    if (readOnly) return;
    const docDiscountPct = parseFloat(data.DiscountPercent || 0);
    setRows(prev => prev.map(row => calcRowTotals(row, docDiscountPct)));
  }, [data.DiscountPercent]);

  // ==============================|| AUTO ADD ROW ||============================== //

  useEffect(() => {
    const last = rows[rows.length - 1];

    const hasData =
      last.ItemCode ||
      last.Quantity ||
      last.UnitPrice;

    if (hasData) {
      setRows(prev => [
        ...prev,
        createRow(Date.now())
      ]);
    }
  }, [rows]);

  // ==============================|| DELETE ROW ||============================== //

  const deleteRow = (id) => {
    if (rows.length <= 1) return;

    setRows((prev) =>
      prev.filter((r) => r.id !== id)
    );
  };

  // ==============================|| TOTALS ||============================== //

  const totalBeforeDiscount = useMemo(() => {
    return rows.reduce(
      (sum, r) =>
        sum + parseFloat(r.LineTotal || 0),
      0
    );
  }, [rows]);

  const totalTax = useMemo(() => {
    return rows.reduce(
      (sum, r) =>
        sum + parseFloat(r.TaxTotal || 0),
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
    ((data.Rounding === true || data.Rounding === 'tYES')
      ? (parseFloat(data.RoundingDiffAmount) || 0)
      : 0)

  // ==============================|| UI ||============================== //

  return (
    <Box>
      {/* ================= TOP FILTER SECTION ================= */}

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
        {/* ITEM / SERVICE */}

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
              disabled={readOnly}
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
              disabled={ readOnly || currencyLoading}
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

    {/* ================= TABLE ================= */}

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
          {/* ================= HEADER ================= */}

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
                  label: 'Item Code',
                  width: 160
                },
                {
                  label: 'Item Description',
                  width: 240
                },
                {
                  label: 'Qty',
                  width: 100
                },
                {
                  label: 'UnitPrice',
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
                  label: 'UOM',
                  width: 180
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

          {/* ================= BODY ================= */}

          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                hover
              >
                {/* SERIAL */}

                <TableCell>
                  {index + 1}
                </TableCell>

                {/* ITEM NO */}

                <TableCell>
                  <TextField
                    size="small"
                    disabled={readOnly}
                    value={row.ItemCode || ""}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'ItemCode',
                        e.target.value
                      )
                    }
                    sx={{
                      width: '100%'
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                              onClick={() =>
                                !readOnly && handleOpenItemPopup(row.id)
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
                      row.ItemDescription
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
                    disabled={readOnly}
                    value={row.Quantity || ""}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'Quantity',
                        e.target.value
                      )
                    }
                    sx={{
                      width: '100%'
                    }}
                  />
                </TableCell>

                {/* UnitPrice */}

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    disabled={readOnly}
                    value={row.UnitPrice || ""}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'UnitPrice',
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
                    disabled={readOnly}
                    value={row.DiscountPercent || ""}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        'DiscountPercent',
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
                    disabled={readOnly}
                    value={row.LineTotal || ""}
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
                    value={row.VatGroup || ""}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(row.id, 'VatGroup', e.target.value)
                    }
                    sx={{ width: '100%' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() =>
                              !readOnly && handleOpenTaxLookup(row.id)
                            }
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
                    disabled={readOnly}
                    value={
                      row.TaxPercentagePerRow || ""
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
                    disabled={readOnly}
                    value={row.TaxTotal || ""}
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
                    disabled={readOnly}
                    value={row.GrossTotal || ""}
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
                    disabled={readOnly}
                    value={row.ProjectCode || ""}
                    onChange={(e) =>
                      updateRow(row.id, 'ProjectCode', e.target.value)
                    }
                    sx={{ width: '100%' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() =>
                              !readOnly && handleOpenProjectLookup(row.id)
                            }
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
                    disabled={readOnly}
                    value={row.WarehouseCode || ""}
                    onChange={(e) =>
                      updateRow(row.id, 'WarehouseCode', e.target.value)
                    }
                    sx={{ width: '100%' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() =>
                              !readOnly && handleOpenWarehouseLookup(row.id)
                            }
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

                <TableCell>
                  {readOnly ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={row.UoMCode || ''}
                      disabled
                    />
                  ) : (
                    <FormControl
                      size="small"
                      fullWidth
                    >
                      <Select
                        value={row.UoMCode || ''}
                        onChange={(e) => {
                          const selected =
                            row.AvailableUOMs?.find(
                              uom =>
                                uom.Code ===
                                e.target.value
                            );

                          setRows(prev =>
                            prev.map(r =>
                              r.id === row.id
                                ? {
                                    ...r,
                                    UoMCode: selected?.Code || '',
                                    UoMEntry: selected?.AbsEntry ?? '',
                                    UoMName: selected?.Name || ''
                                  }
                                : r
                            )
                          );
                        }}
                      >
                        {(row.AvailableUOMs || [])
                          .map((uom) => (
                            <MenuItem
                              key={uom.AbsEntry}
                              value={uom.Code || ""}
                            >
                              {uom.Name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
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

                {!readOnly && (
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => deleteRow(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= BOTTOM SECTION ================= */}

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          mt: 3,
          flexWrap: 'wrap'
        }}
      >

      {/* ================= LEFT SIDE ================= */}

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

          {/* ================= OWNER ================= */}

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
              onChange={(e) =>
                handleChange(
                  'SalesPersonCode',
                  e.target.value
                )
              }
            >
              <MenuItem value="1">
                User 1
              </MenuItem>

              <MenuItem value="2">
                User 2
              </MenuItem>
            </Select>
          </FormControl>

          {/* ================= REMARK ================= */}

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Remark"
            value={data.Comments || ''}
            onChange={(e) =>
              handleChange(
                'Comments',
                e.target.value
              )
            }
          />
        </Paper>
      </Box>

        {/* ================= RIGHT SIDE ================= */}

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

          {/* TOTAL BEFORE DISCOUNT */}

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

          {/* DISCOUNT */}

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

          {/* DISCOUNT AMOUNT */}

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

          {/* ================= FREIGHT ================= */}

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
              onClick={() => setFreightPopupOpen(true)}
              sx={{ width: 120 }}
            >
              {freightTotal > 0 ? freightTotal.toFixed(2) : (readOnly ? '0.00' : 'Add Freight')}
            </Button>
          </Box>

          {/* TAX */}

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

          {/* ROUNDING */}

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
                checked={data.Rounding === true || data.Rounding === 'tYES'}
                sx={{ padding: 0, mr: '2px' }}
                disabled={disableRounding}
                onChange={(e) =>
                  handleChange('Rounding', e.target.checked)
                }
              />

              <Typography>
                Rounding
              </Typography>
            </Box>

            {(data.Rounding === true || data.Rounding === 'tYES') && (
              <TextField
                size="small"
                type="text"
                inputProps={{ inputMode: 'decimal' }}
                sx={{ width: 120 }}
                disabled={readOnly || disableRounding}
                value={data.RoundingDiffAmount}
                onChange={(e) =>
                  handleChange('RoundingDiffAmount', e.target.value)
                }
                onBlur={(e) =>
                  handleChange('RoundingDiffAmount', parseFloat(e.target.value) || 0)
                }
              />
            )}
          </Box>

          {/* FINAL TOTAL */}

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
      <FreightPopup
        open={freightPopupOpen}
        onClose={() => setFreightPopupOpen(false)}
        initialExpenses={data.DocumentAdditionalExpenses || []}
        readOnly={readOnly}
        onApply={(result) => {
          setFreightTotal(result.total);
          setData(prev => ({
            ...prev,
            DocumentAdditionalExpenses: result.expenses
          }));
        }}
      />
    </Box>
  );
}
