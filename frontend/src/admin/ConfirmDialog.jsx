import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

function ConfirmDialog({ dialog, onCancel }) {
  useEffect(() => {
    if (!dialog) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [dialog, onCancel]);

  if (!dialog) {
    return null;
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="admin-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-icon">
          <TriangleAlert aria-hidden="true" size={22} strokeWidth={1.7} />
        </div>
        <h3 id="admin-modal-title">{dialog.title ?? 'Are you sure?'}</h3>
        <p>{dialog.message}</p>
        <div className="admin-modal-actions">
          <button className="admin-secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="admin-danger-button"
            type="button"
            onClick={() => {
              dialog.onConfirm();
              onCancel();
            }}
          >
            {dialog.confirmLabel ?? 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
