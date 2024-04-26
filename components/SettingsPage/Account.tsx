import React, { useState } from "react";
import { View } from "react-native";
import { auth } from "../../firebase/auth";
import {
  signOut,
  reauthenticateWithCredential,
  User,
  EmailAuthProvider,
} from "firebase/auth";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { SignoutDialog } from "./SignoutDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { ReAuthDialog } from "./ReAuthDialog";
import { deleteUserAccount } from "../../firebase/util/account_utils";

function Account({
  user,
  handleError,
}: {
  user: User;
  handleError: (message: string | "") => void;
}) {
  const { t,i18n } = useTranslation();
  const [showConfirmDeleteAccountDialog, setShowConfirmDeleteAccountDialog] =
    useState(false);
  const [showConfirmSignout, setShowConfirmSignout] = useState(false);
  const [showReAuth, setShowReAuth] = useState(false);

  const deleteAccount = async (password: string) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
       await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      await deleteUserAccount(user)
    } catch (error) {
      handleError(error.message);
    }
  }; 

  return (
    <View style={{ paddingTop: 10, alignItems: "center", gap: 40 }}>
      <Button
        buttonColor="orange"
        mode="contained"
        onPress={() => setShowConfirmSignout(true)}
      >
        {t("account.signout")}
      </Button>
      <Button
        textColor="red"
        onPress={() => setShowConfirmDeleteAccountDialog(true)}
      >
        {t("account.deleteAccount")}
      </Button>
      <SignoutDialog
        visible={showConfirmSignout}
        handleDismiss={() => setShowConfirmSignout(false)}
        handleConfirm={() => signOut(auth)}
      />
      <DeleteAccountDialog
        visible={showConfirmDeleteAccountDialog}
        handleDismiss={() => setShowConfirmDeleteAccountDialog(false)}
        handleConfirm={() => {
          setShowConfirmDeleteAccountDialog(false);
          setShowReAuth(true);
        }}
      />
      <ReAuthDialog
        visible={showReAuth}
        handleDismiss={() => setShowReAuth(false)}
        handleConfirm={(password: string) => deleteAccount(password)}
      />
    </View>
  );
}

export { Account };
