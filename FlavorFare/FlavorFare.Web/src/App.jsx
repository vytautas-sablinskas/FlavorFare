import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Layout } from './components/Shared/Layout';
import React, { useEffect } from 'react';

function App() {
    useEffect(() => {
        if (!localStorage.getItem('isAuthenticated')) {
            localStorage.setItem('isAuthenticated', 'false');
        }
        if (!localStorage.getItem('role')) {
            localStorage.setItem('role', 'none');
        }
        if (!localStorage.getItem('accessToken')) {
            localStorage.setItem('accessToken', 'none');
        }
        if (!localStorage.getItem('refreshToken')) {
            localStorage.setItem('refreshToken', 'none');
        }
    }, []); 

    return (
        <Router>
            <Layout>
                <Routes>
                    {AppRoutes.map((route, index) => {
                        if (route.index) {
                            return <Route key={index} path="/" element={route.element} />;
                        }
                        return <Route key={index} path={route.path} element={route.element} />;
                    })}
                </Routes>
            </Layout>
        </Router>
    );
}


export default App;