import React from 'react';
import SuperAdminDashboard from './ui/SuperAdminDashboard';
import { DashboardProvider } from './context/DashboardContext';

const App = () => {
    return (
        <DashboardProvider>
            <SuperAdminDashboard />
        </DashboardProvider>
    );
}

export default App;