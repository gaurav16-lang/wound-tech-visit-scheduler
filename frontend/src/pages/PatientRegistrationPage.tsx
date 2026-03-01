import React, { useState } from 'react';
import {
    Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress
} from '@mui/material';
import { PersonAdd, CheckCircle } from '@mui/icons-material';
import { createPatient } from '../services/api';

const PatientRegistrationPage: React.FC = () => {
    const [form, setForm] = useState({
        firstName: '', lastName: '', dateOfBirth: '', contactNumber: '',
        address: '', email: '', password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess(false);
        try {
            await createPatient(form);
            setSuccess(true);
            setForm({ firstName: '', lastName: '', dateOfBirth: '', contactNumber: '', address: '', email: '', password: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Register Patient</Typography>
                <Typography variant="body2" sx={{ color: '#A0A0C0', mt: 0.5 }}>Add a new patient to the system</Typography>
            </Box>
            <Card sx={{ maxWidth: 700 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #43E68B, #2BA865)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PersonAdd sx={{ color: '#fff' }} />
                        </Box>
                        <Typography variant="h6">Patient Details</Typography>
                    </Box>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} icon={<CheckCircle />}>Patient registered successfully!</Alert>}
                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <TextField fullWidth label="First Name" required value={form.firstName} onChange={handleChange('firstName')} />
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <TextField fullWidth label="Last Name" required value={form.lastName} onChange={handleChange('lastName')} />
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <TextField fullWidth label="Date of Birth" type="date" required value={form.dateOfBirth}
                                    onChange={handleChange('dateOfBirth')} InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <TextField fullWidth label="Contact Number" required value={form.contactNumber} onChange={handleChange('contactNumber')} />
                            </Box>
                            <Box sx={{ flex: '1 1 100%' }}>
                                <TextField fullWidth label="Address" required value={form.address} onChange={handleChange('address')} />
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <TextField fullWidth label="Email Address" type="email" required value={form.email} onChange={handleChange('email')} />
                            </Box>
                            <Box sx={{ flex: '1 1 200px' }}>
                                <TextField fullWidth label="Password" type="password" required value={form.password} onChange={handleChange('password')} helperText="Min 6 characters" />
                            </Box>
                            <Box sx={{ flex: '1 1 100%' }}>
                                <Button
                                    type="submit" variant="contained" disabled={loading} size="large"
                                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAdd />}
                                    sx={{ background: 'linear-gradient(135deg, #43E68B, #2BA865)', color: '#0F0F1A', fontWeight: 700, '&:hover': { background: 'linear-gradient(135deg, #36CC78, #229955)' }, px: 4 }}
                                >
                                    {loading ? 'Registering...' : 'Register Patient'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PatientRegistrationPage;
