import React, { useState } from 'react';
import { 
  TextField, Button, Box, Grid, Card, CardContent,
  Typography, Chip, IconButton, InputAdornment, 
  Paper, Divider, Avatar, Fade, Zoom
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkIcon from '@mui/icons-material/Link';

const ProjectEditForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: project?.id || '',
    title: project?.title || '',
    description: project?.description || '',
    imageUrl: project?.imageUrl || '',
    technologies: project?.technologies || [],
    demoLink: project?.demoLink || ''
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState({});

  // Track field touch state for validation visualization
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    imageUrl: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const isFieldValid = (field) => {
    if (!touched[field]) return null;
    
    switch (field) {
      case 'title':
        return formData.title.trim() !== '';
      case 'description':
        return formData.description.trim() !== '';
      case 'imageUrl':
        return formData.imageUrl.trim() !== '';
      default:
        return true;
    }
  };

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Paper 
        elevation={3} 
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: '800px',
          margin: '0 auto',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #6b46c1 0%, #9f7aea 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ 
            bgcolor: 'white', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            width: 42,
            height: 42
          }}>
            {project ? <EditIcon sx={{ color: '#6b46c1' }} /> : <AddIcon sx={{ color: '#6b46c1' }} />}
          </Avatar>
          <Typography variant="h6" component="h2" sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {project ? 'Edit Project' : 'Add New Project'}
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Project Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur('title')}
                  error={touched.title && !formData.title.trim()}
                  helperText={touched.title && !formData.title.trim() ? 'Title is required' : ''}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: { 
                      borderRadius: '10px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 70, 193, 0.03)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(107, 70, 193, 0.2)'
                      }
                    },
                    endAdornment: touched.title && (
                      <InputAdornment position="end">
                        <Fade in={true}>
                          {isFieldValid('title') ? (
                            <CheckCircleOutlineIcon color="success" />
                          ) : (
                            <ErrorOutlineIcon color="error" />
                          )}
                        </Fade>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Project Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={() => handleBlur('description')}
                  error={touched.description && !formData.description.trim()}
                  helperText={touched.description && !formData.description.trim() ? 'Description is required' : ''}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: { 
                      borderRadius: '10px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 70, 193, 0.03)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(107, 70, 193, 0.2)'
                      }
                    },
                    endAdornment: touched.description && (
                      <InputAdornment position="end">
                        <Fade in={true}>
                          {isFieldValid('description') ? (
                            <CheckCircleOutlineIcon color="success" />
                          ) : (
                            <ErrorOutlineIcon color="error" />
                          )}
                        </Fade>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  onBlur={() => handleBlur('imageUrl')}
                  error={touched.imageUrl && !formData.imageUrl.trim()}
                  helperText={touched.imageUrl && !formData.imageUrl.trim() ? 'Image URL is required' : ''}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: touched.imageUrl && (
                      <InputAdornment position="end">
                        <Fade in={true}>
                          {isFieldValid('imageUrl') ? (
                            <CheckCircleOutlineIcon color="success" />
                          ) : (
                            <ErrorOutlineIcon color="error" />
                          )}
                        </Fade>
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '10px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 70, 193, 0.03)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(107, 70, 193, 0.2)'
                      }
                    }
                  }}
                />
                {formData.imageUrl && (
                  <Fade in={!!formData.imageUrl}>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <Box
                        component="img"
                        src={formData.imageUrl} 
                        alt="Project preview" 
                        sx={{
                          height: '120px', 
                          maxWidth: '100%',
                          objectFit: 'cover', 
                          borderRadius: '10px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Demo Link"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '10px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 70, 193, 0.03)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(107, 70, 193, 0.2)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 1, 
                  fontWeight: 'medium',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(107, 70, 193, 0.1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AddIcon sx={{ fontSize: 14, color: '#6b46c1' }} />
                  </Box>
                  Technologies
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add technology and press Enter"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={handleKeyDown}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={addTechnology} 
                            edge="end"
                            size="small"
                            color="primary"
                            sx={{
                              transition: 'transform 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: 'rgba(107, 70, 193, 0.1)'
                              }
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { 
                        borderRadius: '8px',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(107, 70, 193, 0.2)'
                        }
                      }
                    }}
                  />
                </Box>
                <Box 
                  display="flex" 
                  flexWrap="wrap" 
                  gap={0.8} 
                  sx={{ 
                    minHeight: '40px',
                    p: formData.technologies.length ? 1.5 : 0,
                    borderRadius: '8px',
                    backgroundColor: formData.technologies.length ? 'rgba(107, 70, 193, 0.04)' : 'transparent',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  {formData.technologies.map((tech, index) => (
                    <Zoom in={true} key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Chip
                        label={tech}
                        onDelete={() => removeTechnology(tech)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: 'rgba(107, 70, 193, 0.1)'
                          }
                        }}
                      />
                    </Zoom>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2,
                  mt: 2 
                }}>
                  <Button 
                    onClick={onCancel} 
                    variant="outlined"
                    sx={{ 
                      borderRadius: '10px',
                      px: 3,
                      py: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ 
                      borderRadius: '10px',
                      px: 3,
                      py: 1,
                      background: 'linear-gradient(45deg, #6b46c1 30%, #9f7aea 90%)',
                      boxShadow: '0 2px 8px rgba(107, 70, 193, 0.4)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(107, 70, 193, 0.5)',
                      }
                    }}
                  >
                    {project ? 'Update Project' : 'Save Project'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Paper>
    </Zoom>
  );
};

export default ProjectEditForm;
