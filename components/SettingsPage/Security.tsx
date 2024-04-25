import React, {useState} from "react";
import { User, updateProfile, updatePassword } from "firebase/auth";
import { ScrollView, View } from "react-native";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useErrorAlert,ErrorAlert } from "../CustomeComponent/useErrorAlert";

function Security({ user }: { user: User }) {
  const { t } = useTranslation();
  const { error, setError } = useErrorAlert();
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const passwordForm = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    initialErrors: { password: "" },
    onSubmit: async ({password}) => {
      try {
        await updatePassword(user, password);
        passwordForm.resetForm();
      } catch (error) {
        setError(error.message)
      }
    },
    validate: ({ password, confirmPassword }) => {
      const errors: {
        password?: string;
        confirmPassword?: string;
      } = {};
      if (!password && confirmPassword) {
        errors.password = t("login.required");
      } else if (password.length < 6) {
        errors.password = t("login.minLen", { min: 6 });
      }
      if (!confirmPassword) {
        errors.confirmPassword = t("login.required");
      } else if (confirmPassword !== password) {
        errors.confirmPassword = t("login.passswordMustMatch");
      }
      return errors;
    },
  });

  return (
    <ScrollView
      style={{
        flexGrow: 1,
        height: "100%",
      }}
    >
      <View
        style={{
          flexGrow: 1,
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
              passwordForm.touched.password && !!passwordForm.errors.password
            }
            value={passwordForm.values.password}
            onChangeText={passwordForm.handleChange("password")}
            onBlur={passwordForm.handleBlur("password")}
          />
          {passwordForm.touched.password && !!passwordForm.errors.password && (
            <HelperText
              style={{
                position: "absolute",
                bottom: -25,
              }}
              type="error"
            >
              {passwordForm.errors.password}
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
            label={t("signin.confirmPassword")}
            error={
              passwordForm.touched.confirmPassword &&
              !!passwordForm.errors.confirmPassword
            }
            value={passwordForm.values.confirmPassword}
            onChangeText={passwordForm.handleChange("confirmPassword")}
            onBlur={passwordForm.handleBlur("confirmPassword")}
          />
          {passwordForm.touched.confirmPassword &&
            !!passwordForm.errors.confirmPassword && (
              <HelperText
                style={{
                  position: "absolute",
                  bottom: -25,
                }}
                type="error"
              >
                {passwordForm.errors.confirmPassword}
              </HelperText>
            )}
        </View>
        <Button disabled={!passwordForm.isValid || passwordForm.isSubmitting}>
          Create
        </Button>
        <ErrorAlert visible={error} handleClose={() => setError('')} message={error}/>
      </View>
    </ScrollView>
  );
}

export { Security };
