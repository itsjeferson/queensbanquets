import { CheckCircle2, TriangleAlert, X } from 'lucide-react';

function AdminToastStack({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="admin-toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = toast.type === 'error' ? TriangleAlert : CheckCircle2;

        return (
          <div className={`admin-toast admin-toast-${toast.type}`} key={toast.id}>
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
            <p>{toast.message}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
            >
              <X aria-hidden="true" size={15} strokeWidth={1.8} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default AdminToastStack;
