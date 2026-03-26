import { Toaster, toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (message) => hotToast.success(message),
  error: (message) => hotToast.error(message),
  info: (message) => hotToast(message),
  loading: (message) => hotToast.loading(message),
  dismiss: (id) => hotToast.dismiss(id)
};

export function ToastContainer() {
  return <Toaster position="top-right" />;
}
