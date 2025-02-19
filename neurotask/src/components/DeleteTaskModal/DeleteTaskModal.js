import React from 'react';
import './DeleteTaskModal.css';

const DeleteTaskModal = ({ task, onClose, onConfirm }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Do you want to delete this task?</h3>
        <p><strong>{task.title}</strong></p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
