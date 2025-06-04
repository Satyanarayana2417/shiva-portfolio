import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Typography, CircularProgress,
  Chip, Box, Card, CardContent, CardHeader, Avatar, Divider,
  Fade, Zoom, Tooltip, Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from '@mui/icons-material/Link';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ConfirmDialog from '../ConfirmDialog';

const ProjectList = ({ projects, loading, onEdit, onDelete }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState(null);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(projectToDelete.id);
    setConfirmDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setProjectToDelete(null);
  };

  if (loading) {
    return (
      <Fade in={loading} timeout={800}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          height: '300px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
        }}>
          <CircularProgress 
            size={48} 
            thickness={4}
            sx={{ 
              color: '#6b46c1',
              mb: 3
            }} 
          />
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Loading projects...
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (projects.length === 0) {
    return (
      <Zoom in={true} style={{ transitionDelay: '300ms' }}>
        <Card 
          variant="outlined" 
          sx={{ 
            textAlign: 'center', 
            py: 6,
            px: 2, 
            borderRadius: '16px',
            border: '1px dashed #6b46c1',
            backgroundColor: 'rgba(107, 70, 193, 0.03)'
          }}
        >
          <FolderIcon sx={{ fontSize: 72, color: 'rgba(107, 70, 193, 0.5)', mb: 3 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', mx: 'auto', mt: 1 }}>
            Create your first project using the form above to showcase your work
          </Typography>
        </Card>
      </Zoom>
    );
  }

  return (
    <>
      <TableContainer 
        component={Paper} 
        elevation={2}
        sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.08)'
          }
        }}
      >
        <Table>
          <TableHead sx={{ 
            background: 'linear-gradient(to right, #f9f9f9, #f5f5f5)',
            borderBottom: '2px solid rgba(107, 70, 193, 0.1)'
          }}>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                fontSize: '0.95rem',
                color: '#333',
                pl: 2.5
              }}>Title</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                fontSize: '0.95rem',
                color: '#333',
              }}>Description</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                fontSize: '0.95rem',
                color: '#333',
              }}>Technologies</TableCell>
              <TableCell align="center" sx={{ 
                fontWeight: 'bold',
                fontSize: '0.95rem',
                color: '#333',
              }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => (
              <Fade key={project.id} in={true} style={{ transitionDelay: `${index * 70}ms` }}>
                <TableRow 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(107, 70, 193, 0.02)',
                    },
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 'medium',
                    pl: 2.5,
                    borderLeft: '3px solid transparent',
                    '&:hover': {
                      borderLeft: '3px solid #6b46c1',
                    },
                    transition: 'border-left 0.2s ease'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5
                    }}>
                      {project.imageUrl ? (
                        <Avatar 
                          src={project.imageUrl} 
                          alt={project.title}
                          variant="rounded"
                          sx={{ 
                            width: 48, 
                            height: 48,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                            }
                          }}
                        />
                      ) : (
                        <Avatar 
                          variant="rounded"
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: 'primary.main',
                            boxShadow: '0 2px 6px rgba(107, 70, 193, 0.2)'
                          }}
                        >
                          <FolderIcon />
                        </Avatar>
                      )}
                      <Typography 
                        sx={{ 
                          fontWeight: 500,
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {project.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {project.description ? (
                      <Typography 
                        variant="body2" 
                        sx={{
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          maxHeight: '42px'
                        }}
                      >
                        {project.description}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        No description
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '220px' }}>
                      {project.technologies?.length > 0 ? (
                        <>
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <Chip 
                              key={index} 
                              label={tech} 
                              size="small" 
                              variant="outlined" 
                              color="primary"
                              sx={{ 
                                borderRadius: '4px', 
                                fontSize: '0.7rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: 'rgba(107, 70, 193, 0.1)',
                                  borderColor: '#6b46c1'
                                }
                              }}
                            />
                          ))}
                          {project.technologies.length > 3 && (
                            <Tooltip 
                              title={project.technologies.slice(3).join(", ")}
                              arrow
                              placement="top"
                            >
                              <Chip
                                icon={<MoreHorizIcon fontSize="small" />}
                                label={`+${project.technologies.length - 3}`}
                                size="small"
                                sx={{ 
                                  borderRadius: '4px', 
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(107, 70, 193, 0.08)',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: 'rgba(107, 70, 193, 0.15)',
                                  }
                                }}
                              />
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          No technologies
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Edit project" arrow>
                        <IconButton 
                          color="primary" 
                          onClick={() => onEdit(project)}
                          aria-label="Edit project"
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            '&:hover': {
                              bgcolor: 'rgba(25, 118, 210, 0.2)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete project" arrow>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(project)}
                          aria-label="Delete project"
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                            '&:hover': {
                              bgcolor: 'rgba(211, 47, 47, 0.2)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {project.demoLink && (
                        <Tooltip title="View demo" arrow>
                          <IconButton 
                            color="secondary" 
                            component="a"
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View demo"
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(156, 39, 176, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(156, 39, 176, 0.2)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              </Fade>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {projects.length > 10 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 3,
          '& .MuiPaginationItem-root': {
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(107, 70, 193, 0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: '#6b46c1',
              color: 'white',
              '&:hover': {
                backgroundColor: '#5a3ca6',
              }
            }
          }
        }}>
          <Pagination 
            count={Math.ceil(projects.length / 10)} 
            color="primary" 
            shape="rounded"
          />
        </Box>
      )}

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Project"
        content={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ProjectList;
