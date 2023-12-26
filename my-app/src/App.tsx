import './App.css';
import React from 'react';
import Tasks from './tasks';
import HomePage from './home';
import LoginPage from './loginPage';
import AddTask from './tasks/addTask';
import ViewBatches from './viewBatches';
import ViewCourses from './viewCourses';
import { Route, Routes } from 'react-router-dom';
import ViewTask from './tasks/viewTask';
import { BatchDetails } from './viewBatches/batchDetails';
import { ScheduledTasks } from './viewBatches/scheduledTasks';
import { Analytics } from './analytics';
import UserBatches from './analytics/components/userBatches';


function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} >
          <Route index path='batch' element={<ViewBatches />} />
          <Route path='selected-batch/:batchName' element={<BatchDetails />} />
          <Route path='scheduled-tasks/:batchName'  element={<ScheduledTasks />}></Route>
          <Route path='course' element={<ViewCourses />} />
          <Route path='add-task' element={<AddTask/>} />
          <Route path={`tasks/:course_id`} element={<Tasks />} />
          <Route path={'view-tasks/:task_id'} element={<ViewTask />} />
          <Route path='analytics' element={<Analytics />} />
          <Route path='selectedUser/batches/:user_name' element={<UserBatches />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;