import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function UoMSelectModal({ open, onClose, onSelect, uomList = [], loading = false, itemSelected = true }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select UOM
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 1.5 }}>
        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', width: 50 }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}

              {!loading && !itemSelected && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Select an item first to see available UOMs
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                itemSelected &&
                uomList.map((uom, index) => (
                  <TableRow key={uom.AbsEntry ?? uom.Code ?? index} hover onClick={() => onSelect(uom)} sx={{ cursor: 'pointer' }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{uom.Code}</TableCell>
                    <TableCell>{uom.Name}</TableCell>
                  </TableRow>
                ))}

              {!loading && itemSelected && uomList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No UOMs found for this item
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
