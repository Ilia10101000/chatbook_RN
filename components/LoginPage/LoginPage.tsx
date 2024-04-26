import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button, HelperText, Text } from "react-native-paper";
import { auth } from "../../firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";

function LoginPage() {
  const navigator = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { t } = useTranslation();
  const { error, setError } = useErrorAlert();

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } catch (error) {
        setError(error.message);
      }
    },
    validate: ({ email, password }) => {
      let errors: { email?: string; password?: string } = {};
      if (!email) {
        errors.email = t("login.required");
      } else if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
        errors.email = t("login.validEmail");
      }
      if (!password) {
        errors.password = t("login.required");
      } else if (password.length < 6) {
        errors.password = t("login.minLen", { min: 6 });
      }
      return errors;
    },
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: "center",
          gap: 35,
        }}
      >
        <Text variant="headlineMedium">{t("login.login")}</Text>
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            mode="outlined"
            label={t("login.email")}
            error={loginForm.touched.email && !!loginForm.errors.email}
            onBlur={loginForm.handleBlur("email")}
            onEndEditing={(e) => {
              loginForm.setFieldValue(
                "email",
                e.nativeEvent.text.replace(/\s+/g, "")
              );
            }}
            value={loginForm.values.email}
            onChangeText={loginForm.handleChange("email")}
          />
          {loginForm.touched.email && !!loginForm.errors.email && (
            <HelperText
              style={{
                position: "absolute",
                bottom: -25,
              }}
              type="error"
            >
              {loginForm.errors.email}
            </HelperText>
          )}
        </View>
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            mode="outlined"
            right={
              <TextInput.Icon
                onPress={() => setSecureTextEntry((value) => !value)}
                forceTextInputFocus={false}
                icon={secureTextEntry ? "eye-outline" : "eye-off-outline"}
              />
            }
            secureTextEntry={secureTextEntry}
            error={loginForm.touched.password && !!loginForm.errors.password}
            label={t("login.password")}
            value={loginForm.values.password}
            onChangeText={loginForm.handleChange("password")}
            onBlur={loginForm.handleBlur("password")}
          />
          {loginForm.touched.password && !!loginForm.errors.password && (
            <HelperText
              style={{
                position: "absolute",
                bottom: -25,
              }}
              type="error"
            >
              {loginForm.errors.password}
            </HelperText>
          )}
        </View>
        <Button
          mode="text"
          onPress={() => navigator.navigate("SigninPage" as never)}
        >
          {t("login.createAccount")}
        </Button>
        <Button
          mode="text"
          icon={"google"}
          contentStyle={{ flexDirection: "row-reverse" }}
        >
          {t("login.google")}
        </Button>
        <Button
          disabled={!loginForm.isValid || loginForm.isSubmitting}
          mode="contained-tonal"
          onPress={() => loginForm.handleSubmit()}
        >
          {t("login.loginButton")}
        </Button>
        {error && <Text>{error}</Text>}
      </View>
    </ScrollView>
  );
}

export { LoginPage };
