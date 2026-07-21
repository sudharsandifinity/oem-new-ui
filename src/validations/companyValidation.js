import * as yup from 'yup';

export const companySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Company Name is required'),

  company_db_name: yup
    .string()
    .trim()
    .required('Company DB Name is required'),

  company_code: yup
    .string()
    .trim()
    .required('Company Code is required'),

  max_users: yup
    .number()
    .typeError('Maximum Users is required')
    .positive('Maximum Users must be greater than 0')
    .required('Maximum Users is required'),

  base_url: yup
    .string()
    .trim()
    .url('Enter a valid URL')
    .required('Base URL is required'),

  sap_username: yup
    .string()
    .trim()
    .required('SAP User Name is required'),

  secret_key: yup
    .string()
    .trim()
    .required('Secret Key is required'),
});