import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProjectList from '../../components/admin/ProjectManagement/ProjectList';
import ProjectEditForm from '../../components/admin/ProjectManagement/ProjectEditForm';
import { getProjects, updateProject, deleteProject } from '../../services/projectService';
import { 
  Container, Typography, Box, Alert, Paper, Divider,
  Fade, Grow, LinearProgress, Tabs, Tab, Collapse,
  Slide, Zoom, Card, CardContent
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      await updateProject(updatedProject);
      setProjects(projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      ));
      setSelectedProject(null);
      setSuccessMessage('Project updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setSuccessMessage('Project deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setSelectedProject(null);
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>
        <Box sx={{ mb: 5 }}>
          <Slide direction="down" in={true} timeout={500}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: '#333',
                  mb: 1
                }}
              >
                <FolderIcon 
                  fontSize="large" 
                  color="primary" 
                  sx={{ 
                    backgroundColor: 'rgba(107, 70, 193, 0.1)',
                    padding: '5px',
                    borderRadius: '8px'
                  }} 
                />
                Project Management
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: '650px', lineHeight: 1.6 }}
              >
                Create, edit and manage your portfolio projects. Upload images, add technologies 
                and keep your portfolio updated with your latest work.
              </Typography>
            </Box>
          </Slide>
          <Divider sx={{ mt: 3, mb: 4 }} />
        </Box>
        
        <Collapse in={!!error}>
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              icon={<ErrorOutlineIcon fontSize="inherit" />}
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                alignItems: 'center',
                '& .MuiAlert-icon': {
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '24px',
                  mr: 1.5
                }
              }}
            >
              <Typography variant="subtitle2">{error}</Typography>
            </Alert>
          </Box>
        </Collapse>
        
        <Collapse in={!!successMessage}>
          <Fade in={!!successMessage}>
            <Alert 
              severity="success" 
              onClose={() => setSuccessMessage('')}
              icon={<CloudDoneIcon fontSize="inherit" />}
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                background: 'linear-gradient(to right, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
                alignItems: 'center',
                '& .MuiAlert-icon': {
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '24px',
                  mr: 1.5
                }
              }}
            >
              <Typography variant="subtitle2">{successMessage}</Typography>
            </Alert>
          </Fade>
        </Collapse>

        {!selectedProject && (
          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ 
              mb: 4, 
              borderRadius: '16px',
              background: 'linear-gradient(to right, rgba(107, 70, 193, 0.05), rgba(159, 122, 234, 0.05))',
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={0}
              sx={{ 
                px: 2, 
                pt: 1,
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3
                },
                '& .MuiTab-root': {
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(107, 70, 193, 0.06)',
                    color: '#6b46c1'
                  }
                },
                '& .Mui-selected': {
                  color: '#6b46c1',
                  fontWeight: 600
                }
              }}
            >
              <Tab label="All Projects" />
            </Tabs>
          </Paper>
        )}

        <Box>
          {loading && (
            <Fade in={loading} timeout={800}>
              <LinearProgress 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  height: 6,
                  backgroundColor: 'rgba(107, 70, 193, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6b46c1 0%, #9f7aea 100%)',
                    borderRadius: 2
                  }
                }} 
              />
            </Fade>
          )}
          
          {selectedProject ? (
            <Card elevation={0} sx={{ border: 'none' }}>
              <Box sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <EditIcon 
                  fontSize="small" 
                  color="primary"
                  sx={{
                    backgroundColor: 'rgba(107, 70, 193, 0.1)',
                    padding: '5px',
                    borderRadius: '6px'
                  }}
                />
                <Typography 
                  variant="h6" 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Edit Project
                </Typography>
              </Box>
              <ProjectEditForm 
                project={selectedProject} 
                onSave={handleUpdateProject} 
                onCancel={handleCancel} 
              />
            </Card>
          ) : (
            <ProjectList 
              projects={projects} 
              loading={loading} 
              onEdit={handleEditProject} 
              onDelete={handleDeleteProject} 
            />
          )}
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
