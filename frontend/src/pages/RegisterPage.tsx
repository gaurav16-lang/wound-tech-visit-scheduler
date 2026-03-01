import React, { useState } from 'react';
import {
    Box, Card, CardContent, TextField, Button, Typography, Alert,
    CircularProgress, MenuItem, InputAdornment, IconButton, Link
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'CLINICIAN', label: 'Clinician' },
    { value: 'PATIENT', label: 'Patient' },
];

const RegisterPage: React.FC = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', role: 'PATIENT' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await register(form);
            setAuth(res.data.access_token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'background.default',
            background: 'radial-gradient(ellipse at center, rgba(255,101,132,0.1) 0%, rgba(15,15,26,1) 70%)',
        }}>
            <Card sx={{ width: '100%', maxWidth: 440, mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 3,
                            background: 'linear-gradient(135deg, #FF6584, #6C63FF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 2,
                        }}>
                            <LocalHospital sx={{ color: '#fff', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Create Account</Typography>
                        <Typography variant="body2" sx={{ color: '#A0A0C0', mt: 0.5 }}>
                            Join WoudTech Visit Tracker
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Email Address" type="email" sx={{ mb: 2 }}
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                        />
                        <TextField
                            fullWidth label="Password" type={showPass ? 'text' : 'password'} sx={{ mb: 2 }}
                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
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
                        <TextField
                            fullWidth select label="Role" sx={{ mb: 3 }}
                            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                        >
                            {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                        </TextField>
                        <Button
                            type="submit" fullWidth variant="contained" disabled={loading}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #FF6584, #C8405F)',
                                '&:hover': { background: 'linear-gradient(135deg, #E8546F, #B03050)' },
                            }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#A0A0C0' }}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login" sx={{ color: '#9D97FF', fontWeight: 600 }}>
                            Sign in
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegisterPage;
