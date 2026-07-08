export const mapApiToForm = (userData, companies = []) => {
  const company = companies.find(
    (c) => c.id === userData.companyId
  );

  return {
    id: userData.id,
    name: userData.name,

    companyId: userData.companyId,
    companyNames: company?.name || '',

    userMenuIds:
      userData.UserMenus
        ?.filter((m) => m.parentUserMenuId)
        .map((m) => m.id) || [],

    menuNames:
      userData.UserMenus
        ?.filter((m) => m.parentUserMenuId)
        .map((m) => m.name)
        .join(", ") || "",

    permissions: userData.UserMenus,

    status: userData.status === 1 ? "1" : "0"
  };
};
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

// export const buildPayload = (form) => ({
//  name: form.name,
//   companyId: form.companyId,
//    userMenuIds: form.userMenuIds?.map((id) =>
//      ({
//     menuId:id
//   })),
//   status: form.status,
 
// });
export const buildPayload = (form,rows) => {
  const uniqueMenuIds = [
    ...(form.userMenuIds || []),
    ...(form.parentIds || []),
  ].filter((id, index, arr) => id && arr.indexOf(id) === index);

  return {
    name: form.name,
    companyId: form.companyId,
    userMenuIds: rows.map((row) => ({
      menuId: row.id,
      RoleMenu:{
         can_list: row.can_list,
          can_list_view: row.can_view,
          can_create: row.can_create,
          can_edit: row.can_edit,
          can_delete: row.can_delete
      }
     
    })),
    permissionIds:rows.map((row) => row.id),
    status: form.status==="1"?1:0,
  };
};