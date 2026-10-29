function ConfirmDialog({ isOpen, title = "Confirm Action", message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close-btn" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
