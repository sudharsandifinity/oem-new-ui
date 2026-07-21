export const mapApiToForm = (userData) => ({

    id: userData.id,
    name: userData.name || '',
    company_db_name: userData.company_db_name || '',
    branches:userData.branches||[],
    company_code: userData.company_code || '',
    base_url: userData.base_url,
    sap_username: userData.sap_username ?? false,
    max_users: userData.max_users ?? 1,
    secret_key:userData.secret_key||'',
    status:userData.status,

});



export const buildPayload = (form) => ({
 name: form.name,
  company_db_name: form.company_db_name,
  company_code: form.company_code,
  base_url: form.base_url,
  sap_username: form.sap_username,
  secret_key: form.secret_key,
  max_users:form.max_users||1,
  status: form.status,
});
export const updatebuildPayload = (form) => ({
 name: form.name,
  company_db_name: form.company_db_name,
  company_code: form.company_code,
  base_url: form.base_url,
  sap_username: form.sap_username,
  secret_key: form.secret_key,
  max_users:form.max_users||1,
  status: form.status,
});

