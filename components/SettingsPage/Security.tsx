import React, { useState } from "react";
import {
  User,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../firebase/auth";
import { ScrollView, View } from "react-native";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, HelperText, TextInput } from "react-native-paper";

function Security({
  user,
  handleError,
}: {
  user: User;
  handleError: (message: string | "") => void;
}) {
  const { t } = useTranslation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const passwordForm = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    initialErrors: { newPassword: "" },
    onSubmit: async ({ oldPassword,newPassword }) => {
      try {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          oldPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(user, newPassword);
        passwordForm.resetForm();
        handleError(t("settingsPage.success"))
      } catch (error) {
        if (error.message == "Firebase: Error (auth/invalid-credential).") {
          passwordForm.setFieldError('oldPassword',t('login.wrongPassword'));
          return;
        }
        handleError(error.message);
      }
    },
    validate: ({ newPassword, confirmNewPassword,oldPassword }) => {
      const errors: {
        oldPassword?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      if (!oldPassword) {
        errors.oldPassword = t("login.required");
      } else if (oldPassword.length < 6) {
        errors.oldPassword = t("login.minLen", { min: 6 });
      }
      if (!newPassword && confirmNewPassword) {
        errors.password = t("login.required");
      } else if (newPassword.length < 6) {
        errors.password = t("login.minLen", { min: 6 });
      }
      if (!confirmNewPassword) {
        errors.confirmPassword = t("login.required");
      } else if (confirmNewPassword !== newPassword) {
        errors.confirmPassword = t("login.passswordMustMatch");
      }
      return errors;
    },
  });

  return (
    <ScrollView
      style={{
        height: "96%",
        paddingTop: 20,
      }}
    >
      <View
        style={{
          alignItems: "center",
          gap: 40,
        }}
      >
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            right={
              <TextInput.Icon
                onPress={() => setSecureTextEntry((value) => !value)}
                forceTextInputFocus={false}
                icon={secureTextEntry ? "eye-outline" : "eye-off-outline"}
              />
            }
            mode="outlined"
            secureTextEntry={secureTextEntry}
            label={t("login.password")}
            error={
              passwordForm.touched.oldPassword &&
              !!passwordForm.errors.oldPassword
            }
            value={passwordForm.values.oldPassword}
            onChangeText={passwordForm.handleChange("oldPassword")}
            onBlur={passwordForm.handleBlur("oldPassword")}
          />
          {passwordForm.touched.oldPassword &&
            !!passwordForm.errors.oldPassword && (
              <HelperText
                style={{
                  position: "absolute",
                  bottom: -25,
                }}
                type="error"
              >
                {passwordForm.errors.oldPassword}
              </HelperText>
            )}
        </View>
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            mode="outlined"
            secureTextEntry={secureTextEntry}
            label={t("settingsPage.newPassword")}
            error={
              passwordForm.touched.newPassword &&
              !!passwordForm.errors.newPassword
            }
            value={passwordForm.values.newPassword}
            onChangeText={passwordForm.handleChange("newPassword")}
            onBlur={passwordForm.handleBlur("newPassword")}
          />
          {passwordForm.touched.newPassword &&
            !!passwordForm.errors.newPassword && (
              <HelperText
                style={{
                  position: "absolute",
                  bottom: -25,
                }}
                type="error"
              >
                {passwordForm.errors.newPassword}
              </HelperText>
            )}
        </View>
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            mode="outlined"
            secureTextEntry={secureTextEntry}
            label={t("settingsPage.confirmNewPassword")}
            error={
              passwordForm.touched.confirmNewPassword &&
              !!passwordForm.errors.confirmNewPassword
            }
            value={passwordForm.values.confirmNewPassword}
            onChangeText={passwordForm.handleChange("confirmNewPassword")}
            onBlur={passwordForm.handleBlur("confirmNewPassword")}
          />
          {passwordForm.touched.confirmNewPassword &&
            !!passwordForm.errors.confirmNewPassword && (
              <HelperText
                style={{
                  position: "absolute",
                  bottom: -25,
                }}
                type="error"
              >
                {passwordForm.errors.confirmNewPassword}
              </HelperText>
            )}
        </View>
        <Button
          onPress={() => passwordForm.handleSubmit()}
          disabled={!passwordForm.isValid || passwordForm.isSubmitting}
        >
          {t("login.changePassword")}
        </Button>
      </View>
    </ScrollView>
  );
}

export { Security };
