export const mapApiToForm = (userData, companies = []) => {
  console.log("userData",userData)
  const company = companies.find(
    (c) => c.id === userData.companyId
  );

  return {
    id: userData.id,
    name: userData.name,
    scope: userData.scope,
    companyId: userData.companyId,
    companyNames: company?.name || '',

    userMenuIds:
      userData.UserMenus,
        // ?.filter((m) => m.parentUserMenuId)
        // .map((m) => m.id) || [],

    menuNames:
      userData.UserMenus
        ?.filter((m) => m.parentUserMenuId)
        .map((m) => m.name)
        .join(", ") || "",

    permissions: userData.Permissions,

    status: userData.status === 1 ? "1" : "0"
  };
};


export const buildPayload = (form,rows,permissionIds) => {
  const uniqueMenuIds = [
    ...(form.userMenuIds || []),
    ...(form.parentIds || []),
  ].filter((id, index, arr) => id && arr.indexOf(id) === index);

  return form.scope==="user" ? {
    name: form.name,
    companyId: form.companyId,
    scope:form.scope,
    userMenuIds: rows.map((row) => ({
      menuId: row.id,
         can_view: row.can_view,
          can_list_view: row.can_list,
          can_create: row.can_create,
          can_edit: row.can_edit,
          can_delete: row.can_delete    
         })),
    status: form.status??1,
  }:{
    name: form.name,
    companyId: form.companyId,
    scope:form.scope||'master',
    permissionIds: permissionIds.permissionIds,
    status: form.status??1,
  };
};