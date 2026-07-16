import { useEffect } from 'react';
import { createPortal } from 'react-dom';

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

  const isLogout =
    dialog.variant === 'logout'
    || (dialog.confirmLabel || '').toLowerCase().includes('sign out')
    || (dialog.confirmLabel || '').toLowerCase() === 'logout'
    || (dialog.title || '').toLowerCase().includes('sign out');

  const message = getDialogMessage(dialog, isLogout);
  const confirmLabel = dialog.confirmLabel ?? 'Confirm';
  const cancelLabel = dialog.cancelLabel ?? 'Cancel';

  return createPortal(
    <div
      className="qb-modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className={`qb-modal${isLogout ? ' qb-modal--logout' : ''}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="qb-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="qb-modal__message" id="qb-modal-message">
          {message}
        </p>
        <div className="qb-modal__actions">
          <button className="qb-modal__btn qb-modal__btn--cancel" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className="qb-modal__btn qb-modal__btn--confirm"
            type="button"
            onClick={() => {
              dialog.onConfirm();
              onCancel();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function getDialogMessage(dialog, isLogout) {
  if (isLogout) {
    return 'Are you sure, you want to logout?';
  }

  if (dialog.message) {
    return dialog.message;
  }

  if (dialog.title) {
    return dialog.title.endsWith('?') ? dialog.title : `${dialog.title}?`;
  }

  return 'Are you sure?';
}

export default ConfirmDialog;
