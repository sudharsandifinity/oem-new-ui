import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
  else if (values.newPassword.length < MIN_LENGTH) errors.newPassword = `New password must be at least ${MIN_LENGTH} characters long`;
  else if (values.newPassword === values.currentPassword) errors.newPassword = 'New password must be different from the current one';
  if (!values.confirmPassword) errors.confirmPassword = 'Confirm password is required';
  else if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Confirm password must match new password';

  const isValid = Object.keys(errors).length === 0;

  const setField = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (passwordError) dispatch(clearPasswordState());
  };

  const markTouched = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));
  const toggleVisible = (field) => () => setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleClose = () => {
    if (passwordLoading) return;
    setValues(EMPTY);
    setTouched({});
    dispatch(clearPasswordState());
    onClose();
  };

  const handleSubmit = async () => {
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    if (!isValid) return;
    try {
      await dispatch(changePassword(values)).unwrap();
      onSuccess('Password updated successfully');
      onClose();
    } catch {
      return;
    }
  };

  const field = (name, label, autoComplete) => (
    <Grid item xs={12}>
      <TextField
        fullWidth
        size="small"
        label={label}
        type={visible[name] ? 'text' : 'password'}
        value={values[name]}
        onChange={setField(name)}
        onBlur={markTouched(name)}
        error={Boolean(touched[name] && errors[name])}
        helperText={touched[name] && errors[name] ? errors[name] : ''}
        disabled={passwordLoading}
        autoComplete={autoComplete}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={toggleVisible(name)} edge="end" tabIndex={-1}>
                  {visible[name] ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    </Grid>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Change Password
        </Typography>
        <IconButton onClick={handleClose} disabled={passwordLoading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            {passwordError && (
              <Grid item xs={12}>
                <Alert severity="error">{passwordError}</Alert>
              </Grid>
            )}
            {field('currentPassword', 'Current Password', 'current-password')}
            {field('newPassword', 'New Password', 'new-password')}
            {field('confirmPassword', 'Confirm New Password', 'new-password')}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose} disabled={passwordLoading}>
          Close
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={passwordLoading || !isValid}>
          {passwordLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
