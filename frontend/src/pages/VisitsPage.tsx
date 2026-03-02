import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Typography, CircularProgress, Alert, Chip, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, MenuItem, Select, FormControl, InputLabel, IconButton
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getVisits, getClinicians, getPatients, createVisit, updateVisit, deleteVisit } from '../services/api';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales: { 'en-US': enUS },
});

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    status: string;
    notes: string;
    patientId: number;
    clinicianId: number;
}

const statusColors: Record<string, string> = {
    SCHEDULED: '#6C63FF',
    COMPLETED: '#43E68B',
    CANCELLED: '#FF6584',
};

const VisitsPage: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [clinicians, setClinicians] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    // Filter state
    const [selectedClinicianFilter, setSelectedClinicianFilter] = useState<string>('all');
    const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [form, setForm] = useState({
        subject: '', patientId: '', clinicianId: '', status: 'SCHEDULED',
        notes: '', startTime: '', endTime: '',
    });

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [v, c, p] = await Promise.all([getVisits(), getClinicians(), getPatients()]);
            setClinicians(c.data);
            setPatients(p.data);
            const mapped = v.data.map((visit: any) => ({
                id: visit.id,
                title: `${visit.subject || 'Visit'} - ${visit.patient?.firstName || ''} ${visit.patient?.lastName || ''}`,
                start: new Date(visit.scheduledAt),
                end: new Date(visit.endTime),
                status: visit.status,
                notes: visit.notes || '',
                patientId: visit.patientId,
                clinicianId: visit.clinicianId,
            }));
            setEvents(mapped);
        } catch {
            setError('Failed to load visits. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const openNewDialog = (slotInfo: { start: Date; end: Date }) => {
        if (patients.length === 0 || clinicians.length === 0) {
            setError('Please register at least one patient and one clinician before scheduling visits.');
            return;
        }
        setEditingEvent(null);
        setForm({
            subject: '',
            patientId: String(patients[0]?.id || ''),
            clinicianId: String(clinicians[0]?.id || ''),
            status: 'SCHEDULED',
            notes: '',
            startTime: format(slotInfo.start, "yyyy-MM-dd'T'HH:mm"),
            endTime: format(slotInfo.end, "yyyy-MM-dd'T'HH:mm"),
        });
        setDialogOpen(true);
    };

    const openEditDialog = (event: CalendarEvent) => {
        setEditingEvent(event);
        setForm({
            subject: event.title.split(' - ')[0] || '',
            patientId: String(event.patientId),
            clinicianId: String(event.clinicianId),
            status: event.status,
            notes: event.notes,
            startTime: format(event.start, "yyyy-MM-dd'T'HH:mm"),
            endTime: format(event.end, "yyyy-MM-dd'T'HH:mm"),
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            setError('');
            const payload = {
                subject: form.subject || 'Visit',
                patientId: Number(form.patientId),
                clinicianId: Number(form.clinicianId),
                scheduledAt: new Date(form.startTime).toISOString(),
                endTime: new Date(form.endTime).toISOString(),
                status: form.status,
                notes: form.notes,
            };
            if (editingEvent) {
                await updateVisit(editingEvent.id, payload);
            } else {
                await createVisit(payload);
            }
            setDialogOpen(false);
            fetchAll();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save visit.');
        }
    };

    const handleDelete = async () => {
        if (!editingEvent) return;
        try {
            await deleteVisit(editingEvent.id);
            setDialogOpen(false);
            fetchAll();
        } catch {
            setError('Failed to delete visit.');
        }
    };

    const eventStyleGetter = (event: CalendarEvent) => ({
        style: {
            backgroundColor: statusColors[event.status] || '#6C63FF',
            border: 'none',
            borderRadius: '6px',
            color: event.status === 'COMPLETED' ? '#0F0F1A' : '#fff',
            fontWeight: 600,
            fontSize: '0.8rem',
            padding: '2px 6px',
        },
    });

    const filteredEvents = events.filter((e) => {
        const clinicianMatch = selectedClinicianFilter === 'all' || e.clinicianId === Number(selectedClinicianFilter);
        const patientMatch = selectedPatientFilter === 'all' || e.patientId === Number(selectedPatientFilter);
        const statusMatch = selectedStatusFilter === 'all' || e.status === selectedStatusFilter;
        return clinicianMatch && patientMatch && statusMatch;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Visits &amp; Appointments</Typography>
                    <Typography variant="body2" sx={{ color: '#A0A0C0', mt: 0.5 }}>
                        Schedule and track clinician visits to patients
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {Object.entries(statusColors).map(([status, color]) => (
                            <Chip
                                key={status} label={status} size="small"
                                sx={{ bgcolor: `${color}20`, color, border: `1px solid ${color}40`, fontWeight: 600 }}
                            />
                        ))}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="status-filter-label" sx={{ color: '#A0A0C0' }}>Filter by Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            value={selectedStatusFilter}
                            label="Filter by Status"
                            onChange={(e) => setSelectedStatusFilter(e.target.value)}
                            sx={{ color: '#EAEAEA', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108, 99, 255, 0.3)' } }}
                        >
                            <MenuItem value="all"><em>All Statuses</em></MenuItem>
                            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="clinician-filter-label" sx={{ color: '#A0A0C0' }}>Filter by Clinician</InputLabel>
                        <Select
                            labelId="clinician-filter-label"
                            value={selectedClinicianFilter}
                            label="Filter by Clinician"
                            onChange={(e) => setSelectedClinicianFilter(e.target.value)}
                            sx={{ color: '#EAEAEA', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108, 99, 255, 0.3)' } }}
                        >
                            <MenuItem value="all"><em>All Clinicians</em></MenuItem>
                            {clinicians.map((c: any) => (
                                <MenuItem key={c.id} value={String(c.id)}>Dr. {c.lastName} ({c.specialty})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="patient-filter-label" sx={{ color: '#A0A0C0' }}>Filter by Patient</InputLabel>
                        <Select
                            labelId="patient-filter-label"
                            value={selectedPatientFilter}
                            label="Filter by Patient"
                            onChange={(e) => setSelectedPatientFilter(e.target.value)}
                            sx={{ color: '#EAEAEA', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108, 99, 255, 0.3)' } }}
                        >
                            <MenuItem value="all"><em>All Patients</em></MenuItem>
                            {patients.map((p: any) => (
                                <MenuItem key={p.id} value={String(p.id)}>{p.firstName} {p.lastName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained" startIcon={<AddIcon />}
                        onClick={() => openNewDialog({ start: new Date(), end: new Date(Date.now() + 3600000) })}
                        sx={{
                            background: 'linear-gradient(135deg, #6C63FF, #9D97FF)',
                            '&:hover': { background: 'linear-gradient(135deg, #5A52E8, #8B85F0)' },
                            height: 40
                        }}
                    >
                        New Visit
                    </Button>
                </Box>
            </Box>

            {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#6C63FF' }} />
                </Box>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3, overflow: 'hidden', p: 2,
                        border: '1px solid rgba(108,99,255,0.2)',
                        bgcolor: '#1A1A2E',
                    }}
                >
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 650 }}
                        view={view}
                        onView={setView}
                        date={date}
                        onNavigate={setDate}
                        selectable
                        onSelectSlot={openNewDialog}
                        onSelectEvent={openEditDialog}
                        eventPropGetter={eventStyleGetter}
                        views={['month', 'week', 'day', 'agenda']}
                    />
                </Paper>
            )}

            {/* Visit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { bgcolor: '#1A1A2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {editingEvent ? 'Edit Visit' : 'Schedule New Visit'}
                    <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#A0A0C0' }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                    <TextField fullWidth label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                    <FormControl fullWidth>
                        <InputLabel>Patient</InputLabel>
                        <Select value={form.patientId} label="Patient" onChange={(e) => setForm({ ...form, patientId: e.target.value as string })}>
                            {patients.map((p: any) => (
                                <MenuItem key={p.id} value={String(p.id)}>{p.firstName} {p.lastName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Clinician</InputLabel>
                        <Select value={form.clinicianId} label="Clinician" onChange={(e) => setForm({ ...form, clinicianId: e.target.value as string })}>
                            {clinicians.map((c: any) => (
                                <MenuItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName} ({c.specialty})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField fullWidth label="Start Time" type="datetime-local" value={form.startTime}
                            onChange={(e) => setForm({ ...form, startTime: e.target.value })} InputLabelProps={{ shrink: true }}
                        />
                        <TextField fullWidth label="End Time" type="datetime-local" value={form.endTime}
                            onChange={(e) => setForm({ ...form, endTime: e.target.value })} InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value as string })}>
                            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField fullWidth label="Notes" multiline rows={3} value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    {editingEvent && (
                        <Button onClick={handleDelete} sx={{ color: '#FF6584', mr: 'auto' }}>Delete</Button>
                    )}
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: '#A0A0C0' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}
                        sx={{ background: 'linear-gradient(135deg, #6C63FF, #9D97FF)', '&:hover': { background: 'linear-gradient(135deg, #5A52E8, #8B85F0)' } }}
                    >
                        {editingEvent ? 'Update' : 'Schedule'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VisitsPage;
