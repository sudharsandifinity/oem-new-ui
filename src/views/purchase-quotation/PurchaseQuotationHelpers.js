const splitDate = (value) => (value ? String(value).split('T')[0] : '');

export const mapApiLineToRow = (line, index) => {
  const quantity = line.Quantity ?? '';
  const unitPrice = line.UnitPrice ?? '';
  const discount = line.DiscountPercent ?? 0;
  const taxPercentage = line.TaxPercentagePerRow ?? 0;

  const base = (Number(quantity) || 0) * (Number(unitPrice) || 0);
  const afterDiscount = base - (base * (Number(discount) || 0)) / 100;
  const taxAmt = (afterDiscount * (Number(taxPercentage) || 0)) / 100;

  return {
    id: line.LineNum ?? Date.now() + index,
    itemNo: line.ItemCode ?? '',
    itemDescription: line.ItemDescription ?? '',
    quantity,
    unitPrice,
    discount,
    lineTotal: afterDiscount.toFixed(2),
    taxCode: line.VatGroup ?? '',
    taxPercentage,
    taxAmount: taxAmt.toFixed(2),
    grossTotal: (afterDiscount + taxAmt).toFixed(2),
    project: line.ProjectCode ?? '',
    warehouse: line.WarehouseCode ?? '',
    dimension1: line.CostingCode ?? '',
    dimension2: line.CostingCode2 ?? '',
    dimension3: line.CostingCode3 ?? '',
    dimension4: line.CostingCode4 ?? '',
    dimension5: line.CostingCode5 ?? ''
  };
};

export const mapApiToRows = (order) => (order?.DocumentLines || []).map(mapApiLineToRow);

export const mapApiToForm = (order) => ({
  VendorCode: order.CardCode ?? '',
  VendorName: order.CardName ?? '',
  ContactPerson: order.ContactPerson ?? '',
  NumAtCard: order.NumAtCard ?? '',

  DocDate: splitDate(order.DocDate),
  DocDueDate: splitDate(order.DocDueDate),
  TaxDate: splitDate(order.TaxDate),
  ReqDate:splitDate(order.RequriedDate),

  StatusLabel: order.DocumentStatus === 'bost_Open' ? 'Open' : 'Closed',

  Attachments2_Lines: [],

  DocType: order.DocType || 'dDocument_Items',
  DocCurrency: order.DocCurrency ?? '',
  Comments: order.Comments ?? '',
  SalesPersonCode: order.SalesPersonCode != null ? String(order.SalesPersonCode) : '',
  DiscountPercent: order.DiscountPercent ?? 0,
  Rounding: order.Rounding === 'tYES',
  RoundingDiffAmount: order.RoundingDiffAmount ?? 0,

  DocumentLines: [],
  DocumentAdditionalExpenses: (order.DocumentAdditionalExpenses || []).map((exp) => ({
    freightCode: exp.ExpenseCode,
    remark: exp.Remarks ?? '',
    taxGroup: exp.VatGroup ?? null,
    amount: exp.LineTotal ?? 0
  }))
});

export const buildPurchaseQuotationFormData = (purQuotation, documentLines) => {
  const payload = {
    DocType: purQuotation.DocType,
    VendorCode: purQuotation.CardCode,
    VendorName: purQuotation.CardName,
    NumAtCard: purQuotation.NumAtCard,
    DocDate: purQuotation.DocDate,
    DocDueDate: purQuotation.DocDueDate,
    TaxDate:purQuotation.TaxDate,
    ReqDate:purQuotation.RequriedDate,
    DocCurrency: purQuotation.DocCurrency,
    Comments: purQuotation.Comments,
    ContactPersonCode: purQuotation.ContactPersonCode,
    RequriedDate: purQuotation.TaxDate,
    Rounding: purQuotation.Rounding ? 'tYES' : 'tNO',
    RoundingDiffAmount: purQuotation.RoundingDiffAmount,
    DiscountPercent: purQuotation.DiscountPercent || 0,
          TotalDiscount: purQuotation.discountAmt || 0,
          DocumentsOwner:purQuotation.SalesPersonCode||'',
    DocumentLines: documentLines
      .filter((row) => row.itemNo && Number(row.quantity) > 0)
      .map((row, index) => ({
        LineNum: index,
        ItemCode: row.itemNo,
        ItemDescription: row.itemDescription,
        Quantity: Number(row.quantity),
        UnitPrice: Number(row.unitPrice),
        WarehouseCode: row.warehouse || null,
        ProjectCode: row.project || null,
        VatGroup: row.taxCode || null
      })),
    DocumentAdditionalExpenses: (purQuotation.DocumentAdditionalExpenses || []).map((exp) => ({
      ExpenseCode: Number(exp.freightCode),
      Remarks: exp.remark || '',
      VatGroup: exp.taxGroup || null,
      LineTotal: Number(exp.amount || 0)
    }))
  };

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'DocumentLines' || key === 'DocumentAdditionalExpenses') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value ?? '');
    }
  });

  (purQuotation.Attachments2_Lines || []).forEach((attachment) => {
    if (attachment.file) {
      formData.append('Attachments2_Lines', attachment.file);
    }
  });

  return formData;
};
