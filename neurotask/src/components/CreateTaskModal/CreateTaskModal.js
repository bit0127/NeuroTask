import React, { useState } from 'react';
import config from '../../Config';
import './CreateTaskModal.css';

const CreateTaskModal = ({ onClose, users, fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const token = localStorage.getItem('token');
  const createdBy = localStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: title,
      priority: priority,
      description: description,
      deadline: deadline,
      assigned_to: assignedTo,
      created_by: createdBy,
      status: 'To Do',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
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
        onClose();
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label>Assign To:</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.email} value={user.email}>{user.email}</option>
            ))}
          </select>

          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="">Select User</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

          <label>Deadline:</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />

          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
