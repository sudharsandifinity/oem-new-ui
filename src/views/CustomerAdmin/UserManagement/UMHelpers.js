export const mapApiToForm = (userData) => ({

    id: userData.id,
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    email: userData.email || '',
    status: userData.status,

    // Company
    companies: userData.Companies || [],
    companyIds: userData.Companies?.map((c) => c.id) || [],
    companyNames: userData.Companies?.map((c) => c.name).join(', ') || '',

    // Role
    roles: userData.Roles || [],
    roleIds: userData.Roles?.map((r) => r.id) || [],
    roleNames: userData.Roles?.map((r) => r.name).join(', ') || '',

    // Project
    projects: userData.Projects || [],
    projectIds: userData.Projects?.map((p) => p.id) || [],
    projectNames: userData.Projects?.map((p) => p.Name).join(', ') || ''
});

export const mapApiLineToRow = (line, index) => ({
  id: line.LineId ?? Date.now() + index,
  LineId: line.LineId ?? null,
  BOMLineNum: line.U_SQlineNum ?? '',
  ItemCode: line.U_ItmSerCode ?? '',
  ItemDescription: line.U_ItemDesc ?? '',
  FullDescription: line.U_SerDesc ?? '',
  Quantity: line.U_ReqQty ?? '',
  UoMCode: line.U_UOM ?? '',
  BOMQty: line.U_BOMQty ?? '',
  BOMOpenQty: line.U_BOMOpenQty ?? '',
  MROpenQty: line.U_MROpenQty ?? '',
  WarehouseCode: line.U_Whs ?? '',
  ProjectCode: line.U_Project ?? '',
  IssuedQty: line.U_IssuedQty ?? '',
  InStock: line.U_InStock ?? '',
  Remark: line.U_HLB_Rmarks ?? ''
});

export const buildPayload = (form) => ({
 first_name: form.first_name,
  last_name: form.last_name,
  password:form.password,
  email:form.email,
  roleIds: form.roleIds,
  projectIds: form.projectIds,
  status: form.status,
 
});
