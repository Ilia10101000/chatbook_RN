import React from 'react'
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  Portal,
} from "react-native-paper";

interface IDeleteAccountDialog {
  visible: boolean;
  handleDismiss: () => void;
  handleConfirm: () => void;
}

function DeleteAccountDialog({
  visible,
  handleDismiss,
  handleConfirm,
}: IDeleteAccountDialog) {
  const { t } = useTranslation();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>{t("account.deleteAccount")}?</Dialog.Title>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>{t("login.cancel")}</Button>
          <Button onPress={handleConfirm}>{t("login.delete")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export {DeleteAccountDialog}