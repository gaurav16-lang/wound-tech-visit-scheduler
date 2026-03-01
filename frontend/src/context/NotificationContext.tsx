import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationContextType {
    showError: (msg: string) => void;
    showSuccess: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'error' | 'success'>('error');

    const showError = (msg: string) => {
        setMessage(msg);
        setSeverity('error');
        setOpen(true);
    };

    const showSuccess = (msg: string) => {
        setMessage(msg);
        setSeverity('success');
        setOpen(true);
    };

    useEffect(() => {
        const handleApiError = (event: Event) => {
            const customEvent = event as CustomEvent;
            showError(customEvent.detail);
        };

        window.addEventListener('api-error', handleApiError);
        return () => window.removeEventListener('api-error', handleApiError);
    }, []);

    return (
        <NotificationContext.Provider value={{ showError, showSuccess }}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%', borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};
