"use client";

import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

type NotifyOptions = {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const baseOptions = {
  duration: 4200,
};

export const notify = {
  success(message: string, options?: NotifyOptions) {
    return toast.success(message, {
      ...baseOptions,
      description: options?.description,
      action: options?.action,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    });
  },

  error(message: string, options?: NotifyOptions) {
    return toast.error(message, {
      ...baseOptions,
      duration: 5600,
      description: options?.description,
      action: options?.action,
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    });
  },

  warning(message: string, options?: NotifyOptions) {
    return toast.warning(message, {
      ...baseOptions,
      description: options?.description,
      action: options?.action,
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    });
  },

  info(message: string, options?: NotifyOptions) {
    return toast.info(message, {
      ...baseOptions,
      description: options?.description,
      action: options?.action,
      icon: <Info className="h-5 w-5 text-sky-700" />,
    });
  },

  loading(message: string, options?: NotifyOptions) {
    return toast.loading(message, {
      description: options?.description,
      icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
    });
  },

  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
};
