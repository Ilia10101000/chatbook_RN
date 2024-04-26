import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

interface IReAuthDialog {
  visible: boolean;
  handleDismiss: () => void;
  handleConfirm: (password:string) => void;
}

function ReAuthDialog({
  visible,
  handleConfirm,
  handleDismiss,
}: IReAuthDialog) {
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>{t("account.enterPassword")}</Dialog.Title>
        <Dialog.Content style={{ alignItems: "center" }}>
          <TextInput
            mode="outlined"
            label={t("login.password")}
            style={{ width: 250 }}
            value={password}
            onChangeText={setPassword}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setPassword("");
              handleDismiss();
            }}
          >
            {t("login.cancel")}
          </Button>
          <Button
            disabled={password.length < 6}
            textColor="red"
            onPress={() => handleConfirm(password)}
          >
            {t("login.delete")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export { ReAuthDialog };
