import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  Portal,
} from "react-native-paper";

interface ISignoutDialog{
    visible: boolean;
    handleDismiss: () => void;
    handleConfirm: () => void;
}

function SignoutDialog({ visible, handleDismiss, handleConfirm }:ISignoutDialog) {
    const { t } = useTranslation();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>{t("account.signout")}?</Dialog.Title>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>{t("login.cancel")}</Button>
          <Button onPress={handleConfirm}>{t("signin.confirmButton")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export {SignoutDialog}