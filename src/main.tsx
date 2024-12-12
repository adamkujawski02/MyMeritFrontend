window.global ||= window;
import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

import { loader } from "@monaco-editor/react";
import { toast, ToastContainer, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { SkeletonTheme } from "react-loading-skeleton";

loader.init().then((monaco) => {
  monaco.editor.defineTheme("customTheme", {
    base: "hc-black",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#3a3b46",
      "editor.lineHighlightBackground": "#434450",
    },
  });
});

export const loadingToast = (message: string, id?: number) => {
  if (id) {
    toast.update(id, {
      render: message,
      className: "toast-loading",
      isLoading: true,
      autoClose: false,
    });
    return id;
  } else {
    return toast.loading(message, {
      className: "toast-loading",
      autoClose: false,
    });
  }
};

export const updateToast = (
  message: string,
  type: TypeOptions,
  id?: string
) => {
  if (id) {
    toast.update(id, {
      render: message,
      type: type,
      className: `toast-${type}`,
      isLoading: false,
      autoClose: 1000,
    });
  } else {
    const autoClose = 5000;
    switch (type) {
      case "info":
        toast.info(message, { autoClose: autoClose });
        break;
      case "success":
        toast.success(message, { autoClose: autoClose });
        break;
      case "warning":
        toast.warning(message, { autoClose: autoClose });
        break;
      case "error":
        toast.error(message, { autoClose: autoClose });
        break;
      default:
        toast(message, { autoClose: autoClose });
        break;
    }
  }
};

export const successToast = (message: string, id?: string) => {
  updateToast(message, "success", id);
};
export const errorToast = (message: string, id?: string) => {
  updateToast(message, "error", id);
};

export const toastDismiss = () => {
  toast.dismiss();
};

const queryClient = new QueryClient({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SkeletonTheme baseColor="#21222c" highlightColor="#2c2d37">
            <App />
          </SkeletonTheme>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
          />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  </BrowserRouter>
);
