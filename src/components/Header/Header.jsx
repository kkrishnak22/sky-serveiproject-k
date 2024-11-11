// src/components/Header/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  margin: '0 10px',
  '&:hover': {
    color: theme.palette.accent.main,
  },
  '&.active': {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
}));

export default function Header({ activeTab, setActiveTab, user, logout }) {
  return (
    <AppBar 
      position="static" 
      color="surface" 
      sx={{ 
        width: '100vw', 
        margin: '0 auto', // Centers the AppBar horizontally
        color: 'primary.main',
      
        boxShadow: 3, // Adds a slight shadow for better visibility
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main' }}>
          GeoVisualizer
        </Typography>
        <StyledLink to="/" className={activeTab === 'layers' ? 'active' : ''} onClick={() => setActiveTab('layers')}>
          <Button color="inherit">Layers</Button>
        </StyledLink>
        <StyledLink to="/area" className={activeTab === 'area' ? 'active' : ''} onClick={() => setActiveTab('area')}>
          <Button color="inherit">Area</Button>
        </StyledLink>
        <StyledLink to="/distance" className={activeTab === 'distance' ? 'active' : ''} onClick={() => setActiveTab('distance')}>
          <Button color="inherit">Distance</Button>
        </StyledLink>
        <StyledLink to="/marker" className={activeTab === 'marker' ? 'active' : ''} onClick={() => setActiveTab('marker')}>
          <Button color="inherit">Marker</Button>
        </StyledLink>
        <StyledLink to="/drag_marker" className={activeTab === 'drag_marker' ? 'active' : ''} onClick={() => setActiveTab('drag_marker')}>
          <Button color="inherit">Drag Marker</Button>
        </StyledLink>

        {user ? (
          <StyledLink> <Button color="inherit" onClick={logout}>
            Logout
          </Button></StyledLink>
         
        ) : (
          <>
           <StyledLink> <Button color="inherit" onClick={() => setActiveTab('login')}>Login</Button></StyledLink>
            <StyledLink> <Button color="inherit" onClick={() => setActiveTab('signup')}>Signup</Button></StyledLink>
           
          </>
        )}


      </Toolbar>
    </AppBar>
  );
}
