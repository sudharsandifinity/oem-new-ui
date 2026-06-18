import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ISO_FORMAT = 'YYYY-MM-DD';

export default function AppDatePicker({ label, value, onChange, disabled = false, fullWidth = true, size = 'medium', sx }) {
  const dateValue = value ? dayjs(value, ISO_FORMAT) : null;

  const handleChange = (newValue) => {
    if (!onChange) return;
    onChange(newValue && newValue.isValid() ? newValue.format(ISO_FORMAT) : '');
  };

  return (
    <DatePicker
      label={label}
      format="DD/MM/YYYY"
      value={dateValue}
      onChange={handleChange}
      disabled={disabled}
      slotProps={{
        textField: { fullWidth, size, sx }
      }}
    />
  );
}
