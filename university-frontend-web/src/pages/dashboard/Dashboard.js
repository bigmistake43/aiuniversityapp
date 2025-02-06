import React from 'react';
import './Dashboard.css';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import SendText from '../landingpage/SendText';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            {/* Main Content */}
            <div className="main-content">
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
