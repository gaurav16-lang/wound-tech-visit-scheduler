import React, { useState } from 'react';
import {
    Box, Card, CardContent, TextField, Button, Typography, Alert,
    CircularProgress, InputAdornment, IconButton, Link
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(form);
            setAuth(res.data.access_token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'background.default',
            background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.12) 0%, rgba(15,15,26,1) 70%)',
        }}>
            <Card sx={{ width: '100%', maxWidth: 440, mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 3,
                            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 2,
                        }}>
                            <LocalHospital sx={{ color: '#fff', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#EAEAEA' }}>Welcome Back</Typography>
                        <Typography variant="body2" sx={{ color: '#A0A0C0', mt: 0.5 }}>
                            Sign in to WoudTech Visit Tracker
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Email Address" type="email" sx={{ mb: 2 }}
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth label="Password" type={showPass ? 'text' : 'password'} sx={{ mb: 3 }}
                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass(!showPass)} edge="end" sx={{ color: '#A0A0C0' }}>
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit" fullWidth variant="contained" disabled={loading}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #6C63FF, #9D97FF)',
                                '&:hover': { background: 'linear-gradient(135deg, #5A52E8, #8B85F0)' },
                            }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#A0A0C0' }}>
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/register" sx={{ color: '#9D97FF', fontWeight: 600 }}>
                            Register here
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
