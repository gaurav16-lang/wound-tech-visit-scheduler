import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Lazy loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ClinicianRegistrationPage = lazy(() => import('./pages/ClinicianRegistrationPage'));
const PatientRegistrationPage = lazy(() => import('./pages/PatientRegistrationPage'));
const VisitsPage = lazy(() => import('./pages/VisitsPage'));

// Loading fallback component
const PageLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress sx={{ color: '#6C63FF' }} />
    </Box>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

                    <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<DashboardHome />} />
                        <Route path="clinicians/register" element={<ClinicianRegistrationPage />} />
                        <Route path="patients/register" element={<PatientRegistrationPage />} />
                        <Route path="visits" element={<VisitsPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;
