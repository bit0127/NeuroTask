import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import config from '../../Config';
import './TaskDashboard.css';
import profileIcon from '../../assets/profile-icon.png';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import EditTaskModal from '../../components/EditTaskModal/EditTaskModal';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('email');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    } else {
      fetchTasks();
      fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const response = await fetch(config.getAllUserEmails, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setMessage('Failed to fetch users');
      }
    } catch (error) {
      setMessage('An error occurred while fetching users');
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const columns = useMemo(
    () => [
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'priority', header: 'Priority' },
      { accessorKey: 'description', header: 'Description' },
      { accessorKey: 'deadline', header: 'Deadline' },
      { accessorKey: 'assigned_to', header: 'Assigned To' },
      { accessorKey: 'status', header: 'Status' },
      {
        accessorKey: 'id',
        header: 'Action',
        cell: ({ row }) => (
          <div>
            <button className="edit-btn" onClick={() => handleOpenEditModal(row.original)}>Edit</button>
            <button className="delete-btn" onClick={() => console.log('Delete Task', row.original)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

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
            <p>{userEmail || 'No Email Found'}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <h2>Task Dashboard</h2>
      <button onClick={handleOpenCreateModal}>Create Task</button>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="task-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} onClick={column.column.getCanSort() ? () => column.column.toggleSorting() : undefined}>
                    {flexRender(column.column.columnDef.header, column.getContext())}
                    {column.column.getIsSorted() === 'asc' ? ' ▲' : column.column.getIsSorted() === 'desc' ? ' ▼' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <p>{message}</p>}

      {isCreateModalOpen && <CreateTaskModal onClose={handleCloseCreateModal} users={users} fetchTasks={fetchTasks} />}
      {isEditModalOpen && <EditTaskModal onClose={handleCloseEditModal} users={users} task={editingTask} fetchTasks={fetchTasks} />}
    </div>
  );
};

export default TaskDashboard;
