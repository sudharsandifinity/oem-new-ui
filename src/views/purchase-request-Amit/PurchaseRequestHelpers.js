const splitDate = (value) => (value ? String(value).split('T')[0] : '');

export const mapApiLineToRow = (line, index) => {
  const isServiceLine = !line.ItemCode && !!line.AccountCode;

  const quantity = line.Quantity ?? '';
  const unitPrice = line.UnitPrice ?? '';
  const discount = line.DiscountPercent ?? 0;
  const taxPercentage = line.TaxPercentagePerRow ?? 0;

  const base = (Number(quantity) || 0) * (Number(unitPrice) || 0);
  const afterDiscount = base - (base * (Number(discount) || 0)) / 100;
  const taxAmt = (afterDiscount * (Number(taxPercentage) || 0)) / 100;

  return {
    id: line.LineNum ?? Date.now() + index,
           itemNo: line.ItemCode || line.AccountCode || '',

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
  RequestorType: order.ReqType ?? '',
  ReqCode: order.ReqCode ?? '',
  RequestorName: order.RequesterName ?? '',
  Department: order.Department ?? '',
StatusLabel:order.DocumentStatus === 'bost_Open' ? 'Open' : 'Closed',
  DocDate: splitDate(order.DocDate),
  DocDueDate: splitDate(order.DocDueDate),
  TaxDate: splitDate(order.TaxDate),
  ReqDate:splitDate(order.RequriedDate),

  StatusLabel: order.DocumentStatus === 'bost_Open' ? 'Open' : 'Closed',

  Attachments2_Lines: [],
  DocType: order.DocType || 'dDocument_Items',
  DocCurrency: order.DocCurrency ?? '',
  Comments: order.Comments ?? '',
  SalesPersonCode: order.DocumentsOwner != null ? String(order.DocumentsOwner) : '',
  DiscountPercent: order.DiscountPercent ?? 0,
  Rounding: order.Rounding === 'tYES',
  RoundingDiffAmount: order.RoundingDiffAmount ?? 0,

  DocumentLines: [],
 DocumentAdditionalExpenses: (order.DocumentAdditionalExpenses || [])
    .filter((exp) => exp.ExpenseCode != null && Number(exp.LineTotal ?? 0) > 0)
    .map((exp, i) => {
      const amount = Number(exp.LineTotal ?? 0);
      const hasTax = exp.TaxPercent != null && exp.TaxPercent !== '';
      const taxPercentage = hasTax ? Number(exp.TaxPercent) : '';
      const taxAmount = hasTax ? (amount * Number(taxPercentage)) / 100 : 0;
      return {
        id: i + 1,
        freightCode: exp.ExpenseCode,
        freightName: exp.ExpenseName ?? exp.ShortName ?? '',
        remark: exp.Remarks ?? '',
        amount,
        taxGroup: exp.VatGroup ?? '',
        taxPercentage: hasTax ? String(taxPercentage) : '',
        taxAmount: hasTax ? taxAmount.toFixed(2) : '',
        grossAmount: (amount + taxAmount).toFixed(2)
      };
    })
});

export const buildPurchaseRequestFormData = (purRequest, documentLines) => {
   const isService = purRequest.DocType === 'dDocument_Service';

  const payload = {
    ReqType: String(purRequest.RequestorType) ?? '',
  ReqCode: purRequest.ReqCode ?? '',
  RequestorName: purRequest.RequesterName ?? '',
  Department: purRequest.Department ?? '',
    DocType: purRequest.DocType,
   
    DocDate: purRequest.DocDate,
    DocDueDate: purRequest.DocDueDate,
    TaxDate:purRequest.TaxDate,
    ReqDate:purRequest.RequriedDate,
    DocCurrency: purRequest.DocCurrency,
    Comments: purRequest.Comments,
    ContactPersonCode: purRequest.ContactPersonCode,
    RequriedDate: purRequest.TaxDate,
    Rounding: purRequest.Rounding ? 'tYES' : 'tNO',
    RoundingDiffAmount: purRequest.RoundingDiffAmount,
    DiscountPercent: purRequest.DiscountPercent || 0,
          TotalDiscount: purRequest.discountAmt || 0,
          DocumentsOwner:purRequest.SalesPersonCode||0,
    DocumentLines: documentLines
            .filter((row) => row.itemNo && Number(row.quantity) > 0)
  .map((row, index) =>
        isService
          ? {
              LineNum: index,
              AccountCode: row.itemNo,
              Quantity: Number(row.quantity),
              ItemDescription: row.itemDescription,
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
    DocumentAdditionalExpenses: (purRequest.DocumentAdditionalExpenses || []).map((exp) => ({
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

  (purRequest.Attachments2_Lines || []).forEach((attachment) => {
    if (attachment.file) {
      formData.append('Attachments2_Lines', attachment.file);
    }
  });

  return formData;
};
