import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Snackbar } from "react-native-paper";

function useErrorAlert() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);
  return { error, setError };
}

function ErrorAlert({ visible, handleClose, message }) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={handleClose}
      icon="close"
      onIconPress={handleClose}
    >
      {message}
    </Snackbar>
  );
}

export { useErrorAlert, ErrorAlert };
