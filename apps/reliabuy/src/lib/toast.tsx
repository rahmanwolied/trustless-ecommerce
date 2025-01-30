import { CheckCircle, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      richColors: true,
      style: {
        background: "rgb(0 106 78 / var(--tw-text-opacity, 1))",
      },
      icon: <CheckCircle className="w-4 h-4" />,
      description: description,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      richColors: true,
      icon: <X className="w-4 h-4" />,
      description: description,
    });
  },

  loading: (message: string, description?: string) => {
    toast.loading(message, {
      richColors: true,
      description: description,
    });
  },

  promise: (
    loadingMessage: string,
    successMessage: string,
    errorMessage: string,
    promise: Promise<unknown>
  ) => {
    toast.promise(promise, {
      loading: loadingMessage,
      success: (data) => {
        return successMessage;
      },
      error: errorMessage,
      richColors: true,
    });
  },
};
