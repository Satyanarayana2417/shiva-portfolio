import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  IconButton,
  Zoom,
  Slide,
  Paper
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = ({ open, title, content, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      PaperProps={{
        component: Paper,
        elevation: 6,
        sx: {
          borderRadius: '16px',
          width: '100%',
          maxWidth: '450px',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }
      }}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <Box sx={{ 
        position: 'relative',
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        <DialogTitle 
          id="confirm-dialog-title"
          sx={{ 
            pb: 1.5,
            pt: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2
          }}
        >
          <Zoom in={open} style={{ transitionDelay: open ? '200ms' : '0ms' }}>
            <Box
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                borderRadius: '50%'
              }}
            >
              <WarningIcon color="error" fontSize="large" />
            </Box>
          </Zoom>
          <Typography 
            variant="h6" 
            component="span" 
            sx={{ 
              fontWeight: 600,
              color: '#d32f2f'
            }}
          >
            {title}
          </Typography>
        </DialogTitle>
        
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[600],
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)'
            },
            transition: 'background-color 0.2s ease'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <DialogContentText 
          id="confirm-dialog-description"
          sx={{ color: 'text.primary', lineHeight: 1.6 }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2.5, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Button 
          onClick={onCancel} 
          variant="outlined"
          sx={{ 
            borderRadius: '10px',
            px: 3,
            transition: 'all 0.2s ease',
            borderColor: 'rgba(0,0,0,0.23)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'rgba(0,0,0,0.5)',
              backgroundColor: 'rgba(0,0,0,0.03)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          startIcon={<DeleteForeverIcon />}
          autoFocus
          sx={{ 
            borderRadius: '10px',
            px: 3,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
