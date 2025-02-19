import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';
import config from '../../Config';

const EditTaskModal = ({ onClose, users, task, fetchTasks }) => {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(task.deadline);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '');
  const [status, setStatus] = useState(task.status);

  useEffect(() => {
    setAssignedTo(task.assigned_to || '');
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!task || !task.id) {
    //     console.error("Task ID is undefined:", task);
    //     alert("Task ID is missing. Unable to update task.");
    //     return;
    // }
    const updatedTask = {
        title,
        priority,
        description,
        deadline,
        status,
        assigned_to: assignedTo  // Ensure it matches backend key
    };

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    if (!token) {
        alert("Authorization token is missing. Please log in again.");
        return;
    }

    try {
        const response = await fetch(`${config.BASE_URL}/tasks/${task.task_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Include token in header
            },
            body: JSON.stringify(updatedTask),
        });

        const data = await response.json(); // Try to get response JSON
        if (!response.ok) {
            console.error("Error response from server:", data);
            alert(`Failed to update task: ${data.message || 'Unknown error'}`);
            return;
        }

        console.log("Task updated successfully:", data);
        fetchTasks(); // Refresh the tasks list
        onClose();    // Close modal after success
    } catch (error) {
        console.error('Error updating task:', error);
        alert("Network error: Unable to save changes.");
    }
};

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit} className="edit-task-form">
          <label>Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" />
          </label>
          <label>Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value)} required className="input-field">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="input-field" />
          </label>
          <label>Deadline:
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="input-field" />
          </label>
          <label>Assign To:
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required className="input-field">
              <option value="" disabled>Select a user</option>
              {users.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </label>
          <label>Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)} required className="input-field">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>
          <div className="modal-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
