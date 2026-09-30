import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { IconEye, IconEyeOff } from '@tabler/icons-react';

import { changePassword, clearPasswordState } from '../../../../store/slices/authSlice';

const MIN_LENGTH = 8;
const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordDialog({ open, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { passwordLoading, passwordError } = useSelector((s) => s.auth);

  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [visible, setVisible] = useState({});

  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setTouched({});
      setVisible({});
      dispatch(clearPasswordState());
    }
  }, [open, dispatch]);

  const errors = {};
  if (!values.currentPassword) errors.currentPassword = 'Current password is required';
  if (!values.newPassword) errors.newPassword = 'New password is required';
  else if (values.newPassword.length < MIN_LENGTH) errors.newPassword = `Must be at least ${MIN_LENGTH} characters`;
  else if (values.newPassword === values.currentPassword) errors.newPassword = 'New password must be different from the current one';
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm the new password';
  else if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Passwords do not match';

  const isValid = Object.keys(errors).length === 0;

  const setField = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    dispatch(clearPasswordState());
  };

  const markTouched = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const toggleVisible = (field) => () => setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    if (!isValid) return;
    try {
      await dispatch(changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })).unwrap();
      onSuccess('Password updated successfully');
      onClose();
    } catch {
      // the slice holds the message; it is rendered in the Alert below
    }
  };

  const field = (name, label, autoComplete) => (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={visible[name] ? 'text' : 'password'}
      value={values[name]}
      onChange={setField(name)}
      onBlur={markTouched(name)}
      error={Boolean(touched[name] && errors[name])}
      helperText={(touched[name] && errors[name]) || ' '}
      disabled={passwordLoading}
      autoComplete={autoComplete}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={toggleVisible(name)} edge="end" tabIndex={-1}>
                {visible[name] ? <IconEyeOff size={18} stroke={1.5} /> : <IconEye size={18} stroke={1.5} />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  );

  return (
    <Dialog open={open} onClose={passwordLoading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 0.5 }}>
          {passwordError && <Alert severity="error">{passwordError}</Alert>}
          {field('currentPassword', 'Current Password', 'current-password')}
          {field('newPassword', 'New Password', 'new-password')}
          {field('confirmPassword', 'Confirm New Password', 'new-password')}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={passwordLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={passwordLoading || !isValid}>
          {passwordLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
