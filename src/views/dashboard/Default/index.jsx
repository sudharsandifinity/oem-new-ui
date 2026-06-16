import { useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@mui/material';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'there';

  return (
    <Box sx={{ p: 3 }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, maxWidth: 480 }}>
        <Typography variant="h3" gutterBottom>
          Hi {fullName}, Welcome!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a module from the sidebar to get started.
        </Typography>
      </Paper>
    </Box>
  );
}
