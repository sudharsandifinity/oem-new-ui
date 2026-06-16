import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

import { IconLogout, IconSettings } from '@tabler/icons-react';

export default function ProfileSection() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    state: { borderRadius }
  } = useConfig();

  const { user } = useSelector((s) => s.auth);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User';
  const roleName = user?.Roles?.[0]?.name || '';
  const initials = [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join('').toUpperCase() || 'U';

  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) anchorRef.current.focus();
    prevOpen.current = open;
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setOpen(false);
    setLogoutDialogOpen(true);
  };

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '28px', alignItems: 'center', borderRadius: '27px' }}
        label={<IconSettings stroke={1.5} size="16px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper elevation={8} sx={{ borderRadius: 2, minWidth: 260, overflow: 'hidden' }}>
                {open && (
                  <>
                    {/* User header */}
                    <Box sx={{ px: 2.5, py: 2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.200', color: 'text.primary', fontSize: 15, fontWeight: 700 }}>
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {fullName}
                          </Typography>
                          {roleName && (
                            <Typography variant="caption" color="text.secondary">
                              {roleName}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Actions */}
                    <List component="nav" sx={{ p: 1 }}>
                      <ListItemButton sx={{ borderRadius: `${borderRadius}px`, py: 1 }} onClick={handleLogoutClick}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <IconLogout stroke={1.5} size="18px" color={theme.palette.error.main} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="error">
                              Logout
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setLogoutDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
