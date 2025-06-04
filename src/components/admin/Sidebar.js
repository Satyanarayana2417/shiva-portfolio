import React from 'react';
import { Link } from 'react-router-dom';
import WebIcon from '@mui/icons-material/Web';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Divider, Tooltip } from '@mui/material';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard'
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users'
    },
    {
      text: 'Projects',
      icon: <WebIcon />,
      path: '/admin/projects'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings'
    }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}
      style={{
        boxShadow: isOpen ? '0 0 20px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <Box className="sidebar-header" sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        background: 'linear-gradient(135deg, #6b46c1 0%, #9f7aea 100%)',
        color: 'white'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          <DashboardIcon /> Admin Panel
        </Typography>
        <Tooltip title="Close sidebar" arrow placement="right">
          <button 
            onClick={onClose} 
            className="close-btn"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <CloseIcon fontSize="small" />
          </button>
        </Tooltip>
      </Box>
      <Divider />
      <Box className="sidebar-menu" sx={{ p: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = window.location.pathname === item.path;
          
          return (
            <Link 
              to={item.path} 
              key={index} 
              className="sidebar-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#6b46c1' : '#666',
                backgroundColor: isActive ? 'rgba(107, 70, 193, 0.1)' : 'transparent',
                marginBottom: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(107, 70, 193, 0.05)';
                  e.currentTarget.style.color = '#6b46c1';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <Box sx={{ 
                mr: 2, 
                display: 'flex',
                color: isActive ? '#6b46c1' : 'inherit',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}>
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              >
                {item.text}
              </Typography>
              {isActive && (
                <Box
                  sx={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#6b46c1',
                    ml: 'auto'
                  }}
                />
              )}
            </Link>
          );
        })}
      </Box>
    </div>
  );
};

export default Sidebar;