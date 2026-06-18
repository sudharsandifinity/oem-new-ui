import { Tooltip, Typography } from '@mui/material';

export const formatDateDDMMYYYY = (value) => {
  if (!value) return '';
  const [datePart] = String(value).split('T');
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year}`;
};

export const renderNoWrapCell = (params) => (
  <Tooltip title={params.value || ''} placement="top">
    <Typography noWrap variant="body2">
      {params.value || ''}
    </Typography>
  </Tooltip>
);
