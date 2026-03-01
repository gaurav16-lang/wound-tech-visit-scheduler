import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, Typography, CircularProgress,
    Avatar, Chip, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Collapse, IconButton
} from '@mui/material';
import {
    People as PeopleIcon,
    MedicalServices as MedicalIcon,
    EventAvailable as ScheduledIcon,
    CheckCircle as CompletedIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { getStats, getPatients, getClinicians, getVisits } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface Stats {
    totalPatients: number;
    totalClinicians: number;
    scheduled: number;
    completed: number;
}

const statCards = (stats: Stats) => [
    { label: 'Total Patients', value: stats.totalPatients, icon: <PeopleIcon />, color: '#6C63FF', gradient: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(108,99,255,0.05))' },
    { label: 'Total Clinicians', value: stats.totalClinicians, icon: <MedicalIcon />, color: '#FF6584', gradient: 'linear-gradient(135deg, rgba(255,101,132,0.2), rgba(255,101,132,0.05))' },
    { label: 'Scheduled Visits', value: stats.scheduled, icon: <ScheduledIcon />, color: '#FFC107', gradient: 'linear-gradient(135deg, rgba(255,193,7,0.2), rgba(255,193,7,0.05))' },
    { label: 'Completed Visits', value: stats.completed, icon: <CompletedIcon />, color: '#43E68B', gradient: 'linear-gradient(135deg, rgba(67,230,139,0.2), rgba(67,230,139,0.05))' },
];

const Row = ({ row, type }: { row: any, type: 'patient' | 'clinician' }) => {
    const [open, setOpen] = useState(false);
    const scheduledCount = row.visits.filter((v: any) => v.status === 'SCHEDULED').length;
    const completedCount = row.visits.filter((v: any) => v.status === 'COMPLETED').length;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset', borderColor: 'rgba(108, 99, 255, 0.1) !important' } }}>
                <TableCell sx={{ color: '#EAEAEA', py: 1 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: '#A0A0C0' }}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ color: '#EAEAEA', fontWeight: 600 }}>{row.firstName} {row.lastName}</TableCell>
                {type === 'patient' ? (
                    <TableCell sx={{ color: '#A0A0C0' }}>{row.contactNumber}</TableCell>
                ) : (
                    <TableCell sx={{ color: '#A0A0C0' }}>{row.specialty}</TableCell>
                )}
                <TableCell align="center">
                    <Chip label={`${scheduledCount} Scheduled`} size="small" sx={{ bgcolor: 'rgba(255,193,7,0.1)', color: '#FFC107', mr: 1, border: '1px solid rgba(255,193,7,0.3)' }} />
                    <Chip label={`${completedCount} Completed`} size="small" sx={{ bgcolor: 'rgba(67,230,139,0.1)', color: '#43E68B', border: '1px solid rgba(67,230,139,0.3)' }} />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, p: 2, bgcolor: '#16162A', borderRadius: 2, border: '1px solid rgba(108, 99, 255, 0.1)' }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ color: '#EAEAEA', fontSize: '0.9rem', fontWeight: 700 }}>
                                Appointments History
                            </Typography>
                            {row.visits.length === 0 ? (
                                <Typography variant="body2" sx={{ color: '#A0A0C0' }}>No appointments yet.</Typography>
                            ) : (
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#A0A0C0', borderColor: 'rgba(108, 99, 255, 0.1)' }}>Date &amp; Time</TableCell>
                                            <TableCell sx={{ color: '#A0A0C0', borderColor: 'rgba(108, 99, 255, 0.1)' }}>Subject</TableCell>
                                            <TableCell sx={{ color: '#A0A0C0', borderColor: 'rgba(108, 99, 255, 0.1)' }}>{type === 'patient' ? 'Clinician' : 'Patient'}</TableCell>
                                            <TableCell align="right" sx={{ color: '#A0A0C0', borderColor: 'rgba(108, 99, 255, 0.1)' }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.visits.map((visit: any) => (
                                            <TableRow key={visit.id}>
                                                <TableCell sx={{ color: '#EAEAEA', borderColor: 'rgba(108, 99, 255, 0.1)' }} component="th" scope="row">
                                                    {format(new Date(visit.scheduledAt), 'MMM dd, yyyy h:mm a')}
                                                </TableCell>
                                                <TableCell sx={{ color: '#A0A0C0', borderColor: 'rgba(108, 99, 255, 0.1)' }}>{visit.subject}</TableCell>
                                                <TableCell sx={{ color: '#A0A0C0', borderColor: 'rgba(108, 99, 255, 0.1)' }}>
                                                    {type === 'patient'
                                                        ? `${visit.clinician?.firstName || ''} ${visit.clinician?.lastName || ''}`
                                                        : `${visit.patient?.firstName || ''} ${visit.patient?.lastName || ''}`}
                                                </TableCell>
                                                <TableCell align="right" sx={{ borderColor: 'rgba(108, 99, 255, 0.1)' }}>
                                                    <span style={{
                                                        color: visit.status === 'SCHEDULED' ? '#FFC107' : visit.status === 'COMPLETED' ? '#43E68B' : '#FF6584',
                                                        fontWeight: 600, fontSize: '0.75rem'
                                                    }}>
                                                        {visit.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

const DashboardHome: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats>({ totalPatients: 0, totalClinicians: 0, scheduled: 0, completed: 0 });
    const [patients, setPatients] = useState<any[]>([]);
    const [clinicians, setClinicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const [statsRes, patientsRes, cliniciansRes, visitsRes] = await Promise.all([
                    getStats(), getPatients(), getClinicians(), getVisits()
                ]);
                setStats(statsRes.data);

                const allVisits = visitsRes.data;
                const pts = patientsRes.data.map((p: any) => ({
                    ...p, visits: allVisits.filter((v: any) => v.patientId === p.id).sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                }));
                const clins = cliniciansRes.data.map((c: any) => ({
                    ...c, visits: allVisits.filter((v: any) => v.clinicianId === c.id).sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                }));

                setPatients(pts);
                setClinicians(clins);
            } catch {
                // Handle error silently here
            } finally {
                setLoading(false);
            }
        };
        loadAllData();
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#EAEAEA' }}>Welcome back 👋</Typography>
                <Typography variant="body1" sx={{ color: '#A0A0C0', mt: 0.5 }}>
                    {user?.email} ·{' '}
                    <Chip label={user?.role} size="small" sx={{ bgcolor: 'rgba(108,99,255,0.2)', color: '#9D97FF', height: 20, fontSize: '0.7rem' }} />
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: '#6C63FF' }} />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {statCards(stats).map((card) => (
                        <Card key={card.label} sx={{
                            flex: '1 1 220px', background: card.gradient, border: `1px solid ${card.color}30`,
                            transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${card.color}20` },
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: `${card.color}20`, color: card.color, width: 48, height: 48 }}>{card.icon}</Avatar>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</Typography>
                                <Typography variant="body2" sx={{ color: '#A0A0C0', mt: 1, fontWeight: 500 }}>{card.label}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {!loading && (
                <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Patients Table */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <PeopleIcon sx={{ color: '#6C63FF' }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Patients Overview</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{ bgcolor: '#1A1A2E', border: '1px solid rgba(108, 99, 255, 0.2)', borderRadius: 2 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#16162A' }}>
                                    <TableRow>
                                        <TableCell sx={{ width: 50, borderColor: 'rgba(108, 99, 255, 0.2)' }} />
                                        <TableCell sx={{ color: '#EAEAEA', fontWeight: 600, borderColor: 'rgba(108, 99, 255, 0.2)' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#EAEAEA', fontWeight: 600, borderColor: 'rgba(108, 99, 255, 0.2)' }}>Contact Number</TableCell>
                                        <TableCell align="center" sx={{ color: '#EAEAEA', fontWeight: 600, borderColor: 'rgba(108, 99, 255, 0.2)' }}>Appointments</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {patients.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: '#A0A0C0' }}>No patients found.</TableCell></TableRow>
                                    ) : patients.map(p => <Row key={`p-${p.id}`} row={p} type="patient" />)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Clinicians Table */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <MedicalIcon sx={{ color: '#FF6584' }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Clinicians Overview</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{ bgcolor: '#1A1A2E', border: '1px solid rgba(255, 101, 132, 0.2)', borderRadius: 2 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#16162A' }}>
                                    <TableRow>
                                        <TableCell sx={{ width: 50, borderColor: 'rgba(255, 101, 132, 0.2)' }} />
                                        <TableCell sx={{ color: '#EAEAEA', fontWeight: 600, borderColor: 'rgba(255, 101, 132, 0.2)' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#EAEAEA', fontWeight: 600, borderColor: 'rgba(255, 101, 132, 0.2)' }}>Specialty</TableCell>
                                        <TableCell align="center" sx={{ color: '#EAEAEA', fontWeight: 600, borderColor: 'rgba(255, 101, 132, 0.2)' }}>Appointments</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clinicians.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: '#A0A0C0' }}>No clinicians found.</TableCell></TableRow>
                                    ) : clinicians.map(c => <Row key={`c-${c.id}`} row={c} type="clinician" />)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default DashboardHome;
