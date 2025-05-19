import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const CustomModal = ({ open, onClose, title, children, actions }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Typography component="div" variant="body1">
          {children}
        </Typography>
      </DialogContent>
      {actions && (
        <DialogActions>
          {actions.map((action, idx) => (
            <Button key={idx} onClick={action.onClick} color={action.color || 'primary'} variant={action.variant || 'contained'}>
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

// Contoh penggunaan modal
export const ExampleModalUsage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Buka Modal Contoh
      </Button>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Contoh Modal MUI"
        actions={[
          { label: 'Tutup', onClick: handleClose, color: 'secondary', variant: 'outlined' },
          { label: 'OK', onClick: handleClose, color: 'primary', variant: 'contained' },
        ]}
      >
        Ini adalah isi dari modal berbasis Material UI (MUI).
      </CustomModal>
    </div>
  );
};

export default CustomModal;