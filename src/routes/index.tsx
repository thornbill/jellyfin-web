import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Test = () => (
    <div className='page libraryPage mainAnimatedPage'>
        <h1>Test Component</h1>
    </div>
);

const AppRoutes = () => (
    <Routes>
        <Route path='/test' element={<Test />} />
    </Routes>
);

export default AppRoutes;
