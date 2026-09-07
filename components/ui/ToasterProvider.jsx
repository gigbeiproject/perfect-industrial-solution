"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontSize: "14px",
          borderRadius: "6px",
        },
        success: { iconTheme: { primary: "#e31e24", secondary: "#fff" } },
      }}
    />
  );
}
