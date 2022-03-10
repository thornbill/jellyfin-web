import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './Home';

import '../assets/css/librarybrowser.scss';

const Details = () => (
    <div className='page libraryPage mainAnimatedPage'>
        <h1>Details</h1>
    </div>
);

const AppRoutes = () => (
    <Routes>
        <Route path='/'>
            <Route index element={<Navigate to='/home.html' />} />
            <Route path='home.html' element={<Home />} />
            <Route path='details.html' element={<Details />} />
        </Route>
    </Routes>
);

export default AppRoutes;
