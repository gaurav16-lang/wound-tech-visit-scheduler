import React, { useState } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, IconButton, Avatar, Chip, Divider, Tooltip
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    PersonAdd as PersonAddIcon,
    MedicalServices as MedicalServicesIcon,
    CalendarMonth as CalendarIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Register Clinician', icon: <MedicalServicesIcon />, path: '/dashboard/clinicians/register' },
    { label: 'Register Patient', icon: <PersonAddIcon />, path: '/dashboard/patients/register' },
    { label: 'Visits & Appointments', icon: <CalendarIcon />, path: '/dashboard/visits' },
];

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 42, height: 42, borderRadius: 2,
                    background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <LocalHospitalIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ lineHeight: 1.2, color: '#fff', fontSize: '1rem' }}>WoudTech</Typography>
                    <Typography variant="caption" sx={{ color: '#A0A0C0' }}>Visit Tracker</Typography>
                </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(108,99,255,0.15)', mx: 2 }} />

            {/* Nav Items */}
            <List sx={{ px: 1.5, py: 2, flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    background: isActive ? 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(108,99,255,0.1))' : 'transparent',
                                    border: isActive ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                                    '&:hover': {
                                        background: 'rgba(108,99,255,0.12)',
                                        border: '1px solid rgba(108,99,255,0.2)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#9D97FF' : '#A0A0C0' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? '#EAEAEA' : '#A0A0C0',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User Section */}
            <Divider sx={{ borderColor: 'rgba(108,99,255,0.15)', mx: 2 }} />
            <Box sx={{ p: 2 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                    borderRadius: 2, background: 'rgba(108,99,255,0.08)',
                    border: '1px solid rgba(108,99,255,0.15)',
                }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#6C63FF', fontSize: '0.85rem' }}>
                        {user?.email?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: '#EAEAEA', display: 'block', fontWeight: 600, fontSize: '0.8rem' }}>
                            {user?.email?.split('@')[0]}
                        </Typography>
                        <Chip
                            label={user?.role}
                            size="small"
                            sx={{
                                height: 18, fontSize: '0.65rem', fontWeight: 600,
                                bgcolor: 'rgba(108,99,255,0.2)', color: '#9D97FF',
                            }}
                        />
                    </Box>
                    <Tooltip title="Logout">
                        <IconButton size="small" onClick={handleLogout} sx={{ color: '#FF6584' }}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Mobile AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    display: { md: 'none' },
                    background: 'rgba(15,15,26,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(108,99,255,0.2)',
                }}
            >
                <Toolbar>
                    <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1, color: '#EAEAEA' }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#6C63FF' }}>WoudTech</Typography>
                </Toolbar>
            </AppBar>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: { xs: 7, md: 0 },
                    minHeight: '100vh',
                    background: 'radial-gradient(ellipse at top left, rgba(108,99,255,0.05) 0%, transparent 50%)',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
