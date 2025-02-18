import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../Config';
import './TaskDashboard.css';
import profileIcon from '../../assets/profile-icon.png';
import { useTable, useSortBy } from '@tanstack/react-table';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('email');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    } else {
      fetchTasks();
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handleBackButton);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [token, navigate]);

  const handleBackButton = () => {
    window.history.pushState(null, '', window.location.href);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(config.gettaskList, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        setMessage('Failed to fetch tasks');
      }
    } catch (error) {
      setMessage('An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    const taskData = { title: 'New Task', description: 'Task description' };
    const response = await fetch(config.createTaskUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      fetchTasks();
    } else {
      setMessage('Failed to create task');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setTasks(sortedTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/', { replace: true });
  };

  return (
    <div className="task-dashboard-container">
      <div className="profile-container" ref={dropdownRef}>
        <img
          src={profileIcon}
          alt="Profile Icon"
          className="profile-icon"
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        />
        {isDropdownVisible && (
          <div className="profile-dropdown">
            <p style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              fontSize: userEmail && userEmail.length > 20 ? '12px' : '14px'
            }}>
              {userEmail || 'No Email Found'}
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <h2>Task Dashboard</h2>
      <button onClick={handleCreateTask}>Create Task</button>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                Priority {sortConfig.key === 'priority' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>{task.description}</td>
                <td>
                  <button className="edit-btn" onClick={() => console.log('Edit Task')}>Edit</button>
                  <button className="delete-btn" onClick={() => console.log('Delete Task')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default TaskDashboard;
