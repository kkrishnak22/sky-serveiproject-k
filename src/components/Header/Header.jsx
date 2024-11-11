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
  const handleGuestClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please login to access this tab.");
    }
  };

  return (
    <AppBar 
      position="static" 
      color="surface" 
      sx={{ 
        width: '100vw', 
        margin: '0 auto', 
        color: 'primary.main',
        boxShadow: 3, 
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main' }}>
          GeoVisualizer
        </Typography>
        <StyledLink to="/" className={activeTab === 'layers' ? 'active' : ''} onClick={() => setActiveTab('layers')}>
          <Button color="inherit">Layers</Button>
        </StyledLink>
        <StyledLink to="/area" className={activeTab === 'area' ? 'active' : ''} onClick={(e) => { handleGuestClick(e); setActiveTab('area'); }}>
          <Button color="inherit" disabled={!user}>Area</Button>
        </StyledLink>
        <StyledLink to="/distance" className={activeTab === 'distance' ? 'active' : ''} onClick={(e) => { handleGuestClick(e); setActiveTab('distance'); }}>
          <Button color="inherit" disabled={!user}>Distance</Button>
        </StyledLink>
        <StyledLink to="/marker" className={activeTab === 'marker' ? 'active' : ''} onClick={(e) => { handleGuestClick(e); setActiveTab('marker'); }}>
          <Button color="inherit" disabled={!user}>Marker</Button>
        </StyledLink>
        <StyledLink to="/drag_marker" className={activeTab === 'drag_marker' ? 'active' : ''} onClick={(e) => { handleGuestClick(e); setActiveTab('drag_marker'); }}>
          <Button color="inherit" disabled={!user}>Drag Marker</Button>
        </StyledLink>

        {user ? (
          <StyledLink><Button color="inherit" onClick={logout}>Logout</Button></StyledLink>
        ) : (
          <StyledLink><Button color="inherit" onClick={() => setActiveTab('login')}>Login</Button></StyledLink>
        )}
      </Toolbar>
    </AppBar>
  );
}
