const today = new Date().toISOString().split('T')[0];

export const computePRLineAmounts = (row) => {
  const qty = parseFloat(row.Quantity || 0);
  const price = parseFloat(row.UnitPrice || 0);
  const discount = parseFloat(row.Discount || 0);
  const taxPct = parseFloat(row.TaxPercentage || 0);

  const base = qty * price;
  const afterDiscount = base - (base * discount) / 100;
  const taxAmt = (afterDiscount * taxPct) / 100;

  return {
    LineTotal: afterDiscount.toFixed(2),
    TaxAmount: taxAmt.toFixed(2),
    GrossTotal: (afterDiscount + taxAmt).toFixed(2)
  };
};

export const mapApiToForm = (pr) => ({
  MRNo: pr.U_MRNo ?? '',
  MRDocEntry: pr.U_MRNo ?? null,
  ProjectCode: pr.U_PrjCode ?? '',
  ProjectName: pr.U_PrjDesc ?? '',
  DocDate: pr.DocDate?.split('T')[0] ?? today,
  TaxDate: pr.TaxDate?.split('T')[0] ?? today,
  RequiredDate: pr.RequriedDate?.split('T')[0] ?? '',
  ReqCode: pr.ReqCode ?? '',
  ReqType: pr.ReqType ?? null,
  RequestorTypeLabel: pr.ReqType === 'E' ? 'Employee' : pr.ReqType === 'U' ? 'User' : '',
  RequestorName: pr.RequesterName ?? '',
  Department: pr.RequesterDepartment != null ? String(pr.RequesterDepartment) : '',
  DeptId: pr.RequesterDepartment != null ? String(pr.RequesterDepartment) : '',
  Comments: pr.Comments ?? '',
  DocumentAdditionalExpenses: (pr.DocumentAdditionalExpenses || [])
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

export const mapApiLineToRow = (line, index) => {
  const row = {
    id: line.LineNum ?? Date.now() + index,
    MRLine: line.U_MRLine ?? '',
    ItemCode: line.ItemCode ?? '',
    ItemDescription: line.ItemDescription ?? '',
    FullDescription: line.U_HLB_FullDesc ?? '',
    Quantity: line.Quantity ?? '',
    UoMCode: line.UoMCode ?? '',
    UnitPrice: line.UnitPrice ?? line.Price ?? '',
    Discount: line.DiscountPercent ?? '',
    TaxCode: line.VatGroup ?? line.TaxCode ?? '',
    TaxPercentage: line.TaxPercentagePerRow ?? '',
    WarehouseCode: line.WarehouseCode ?? '',
    ProjectCode: line.ProjectCode ?? '',
    RequiredDate: line.RequiredDate?.split('T')[0] ?? '',
    Remark: line.U_HLB_Rmarks ?? ''
  };
  return { ...row, ...computePRLineAmounts(row) };
};

export const emptyPRRow = () => ({
  id: Date.now() + Math.random(),
  MRLine: '',
  ItemCode: '',
  ItemDescription: '',
  FullDescription: '',
  Quantity: '',
  UoMCode: '',
  UnitPrice: '',
  Discount: '',
  TaxCode: '',
  TaxPercentage: '',
  LineTotal: '',
  TaxAmount: '',
  GrossTotal: '',
  WarehouseCode: '',
  ProjectCode: '',
  RequiredDate: '',
  Remark: ''
});

export const mrLineToPRRow = (mrLine) => {
  const row = {
    id: Date.now() + Math.random(),
    MRLine: mrLine.LineId ?? mrLine.id ?? '',
    ItemCode: mrLine.ItemCode ?? '',
    ItemDescription: mrLine.ItemDescription ?? '',
    FullDescription: mrLine.FullDescription ?? '',
    Quantity: mrLine.Quantity ?? '',
    UoMCode: mrLine.UoMCode ?? '',
    UnitPrice: mrLine.UnitPrice ?? '',
    Discount: mrLine.Discount ?? '',
    TaxCode: mrLine.TaxCode ?? '',
    TaxPercentage: mrLine.TaxPercentage ?? '',
    WarehouseCode: mrLine.WarehouseCode ?? '',
    ProjectCode: mrLine.ProjectCode ?? '',
    RequiredDate: '',
    Remark: mrLine.Remark ?? ''
  };
  return { ...row, ...computePRLineAmounts(row) };
};

export const buildPRPayload = (form, lines, user) => ({
  DocDate: form.DocDate ? `${form.DocDate}T00:00:00Z` : null,
  TaxDate: form.TaxDate ? `${form.TaxDate}T00:00:00Z` : null,
  RequriedDate: form.RequiredDate ? `${form.RequiredDate}T00:00:00Z` : null,
  Comments: form.Comments ?? '',
  ReqType: form.RequestorTypeLabel === 'User' ? 12 : form.RequestorTypeLabel === 'Employee' ? 171 : null,
  ReqCode: form.ReqCode ?? '',
  RequesterName: form.RequestorName ?? '',
  RequesterDepartment: form.DeptId ? Number(form.DeptId) : null,
  SendNotification: 'tNO',
  U_MRNo: form.MRNo ? Number(form.MRNo) : null,
  U_OEM_UID: user?.id ?? null,
  U_PrjCode: form.ProjectCode ?? '',
  U_PrjDesc: form.ProjectName ?? '',
  U_OEM_UEMAIL: user?.email ?? null,
  U_OEM_UName: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || null,
  U_PreparedBy: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || null,
  DocumentLines: lines
    .filter((line) => line.ItemCode || Number(line.Quantity) > 0)
    .map((line, index) => ({
      LineNum: index,
      ItemCode: line.ItemCode,
      ItemDescription: line.ItemDescription,
      U_HLB_FullDesc: line.FullDescription,
      Quantity: Number(line.Quantity) || 0,
      UnitPrice: Number(line.UnitPrice) || 0,
      DiscountPercent: Number(line.Discount) || 0,
      VatGroup: line.TaxCode || null,
      ProjectCode: line.ProjectCode,
      WarehouseCode: line.WarehouseCode,
      UoMCode: line.UoMCode,
      U_MRDocEntry: form.MRDocEntry ? Number(form.MRDocEntry) : null,
      U_MRLine: line.MRLine !== '' && line.MRLine != null ? Number(line.MRLine) : null,
      RequiredDate: line.RequiredDate ? `${line.RequiredDate}T00:00:00Z` : null,
      U_HLB_Rmarks: line.Remark
    })),
  DocumentAdditionalExpenses: (form.DocumentAdditionalExpenses || []).map((exp) => ({
    ExpenseCode: Number(exp.freightCode),
    Remarks: exp.remark || '',
    VatGroup: exp.taxGroup || null,
    LineTotal: Number(exp.amount || 0)
  }))
});
