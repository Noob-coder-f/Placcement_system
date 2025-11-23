// pages/Dashboard.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import Profile from './components/Profile';
import Jobs from './components/Jobs';
import StudyMaterial from './components/StudyMaterial';
import VideoLectures from './components/VideoLectures';
import Classes from './components/Classes';
import Payments from './components/Payments';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'profile':
        return <Profile />;
      case 'jobs':
        return <Jobs />;
      case 'study-material':
        return <StudyMaterial />;
      case 'video-lectures':
        return <VideoLectures />;
      case 'classes':
        return <Classes />;
      case 'payments':
        return <Payments />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 ml-64">
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard;