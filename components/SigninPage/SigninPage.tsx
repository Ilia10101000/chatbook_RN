import React, { useEffect, useState } from "react";
import { Image, ScrollView, View, Pressable } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  FAB,
  Snackbar,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, auth, db, ref } from "../../firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  AVATAR_S,
  USERS_D,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";
import { getBlobFroUri } from "../../firebase/util/fs";

function SigninPage({navigation}) {
  const { t } = useTranslation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { error, setError } = useErrorAlert();
  const signinForm = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoURL: "",
    },
    onSubmit: async (data) => {
      try {
        const { displayName, photoURL, password, email } = data;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        let photoUrlLink = "";
        if (photoURL) {
          const blobImageData = await getBlobFroUri(photoURL);
          await uploadBytes(
            ref(storage, `${AVATAR_S}/${userCredentials.user.uid}/${AVATAR_S}`),
            blobImageData as Blob
          );
          photoUrlLink = await getDownloadURL(
            ref(storage, `${AVATAR_S}/${userCredentials.user.uid}/${AVATAR_S}`)
          );
        }
        await updateProfile(userCredentials.user, {
          displayName,
          photoURL: photoUrlLink,
        });
        await setDoc(doc(db, USERS_D, userCredentials.user.uid), {
          id: userCredentials.user.uid,
          displayName,
          email,
          photoURL: photoUrlLink,
          searchQuery: displayName.toLowerCase(),
        });
      } catch (error) {
        setError(error.message);
      }
    },
    validate: ({ displayName, email, password, confirmPassword }) => {
      const errors: {
        displayName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      if (!displayName) {
        errors.displayName = t("login.required");
      } else if (displayName.length < 2) {
        errors.displayName = t("login.enterName");
      } else if (
        !displayName.match(/^(?!-)(?!.*-\s*-)[A-Za-zА-Яа-яЁёЇїІіЄєҐґ -]+$/)
      ) {
        errors.displayName = t("login.checkValue");
      }
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
      if (!confirmPassword) {
        errors.confirmPassword = t("login.required");
      } else if (confirmPassword !== password) {
        errors.confirmPassword = t("login.passswordMustMatch");
      }
      return errors;
    },
  });

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        signinForm.setFieldValue("photoURL", result.assets[0].uri);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      title: t("signin.signin"),
    });
  },[])
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: "center",
          gap: 35,
        }}
      >
        <Text variant="headlineMedium">{t("signin.fill")}</Text>
        {signinForm.values.photoURL ? (
          <View>
            <Image
              source={{
                uri: signinForm.values.photoURL,
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
              }}
            />
            <FAB
              icon="trash-can"
              style={{
                position: "absolute",
                top: 0,
                right: -30,
                backgroundColor: "#e1e1e1",
              }}
              onPress={() => signinForm.setFieldValue("photoURL", "")}
              size="small"
            />
          </View>
        ) : (
          <Pressable
            onPress={pickImage}
            style={{
              width: 200,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderStyle: "dotted",
              borderColor: "#8c8c8c",
              borderRadius: 100,
              padding: 20,
            }}
          >
            <Text>{t("signin.selectAvatar")}</Text>
          </Pressable>
        )}
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            mode="outlined"
            error={
              signinForm.touched.displayName && !!signinForm.errors.displayName
            }
            label={t("login.name")}
            value={signinForm.values.displayName}
            onEndEditing={(e) => {
              signinForm.setFieldValue(
                "displayName",
                e.nativeEvent.text.trim().replace(/\s{2,}/g, " ")
              );
            }}
            onChangeText={signinForm.handleChange("displayName")}
            onBlur={signinForm.handleBlur("displayName")}
          />
          {signinForm.touched.displayName &&
            !!signinForm.errors.displayName && (
              <HelperText
                style={{
                  position: "absolute",
                  bottom: -25,
                }}
                type="error"
              >
                {signinForm.errors.displayName}
              </HelperText>
            )}
        </View>
        <View>
          <TextInput
            style={{
              width: 250,
            }}
            mode="outlined"
            label={t("login.email")}
            error={signinForm.touched.email && !!signinForm.errors.email}
            onEndEditing={(e) => {
              signinForm.setFieldValue(
                "email",
                e.nativeEvent.text.replace(/\s+/g, "")
              );
            }}
            value={signinForm.values.email}
            onChangeText={signinForm.handleChange("email")}
            onBlur={signinForm.handleBlur("email")}
          />
          {signinForm.touched.email && !!signinForm.errors.email && (
            <HelperText
              style={{
                position: "absolute",
                bottom: -25,
              }}
              type="error"
            >
              {signinForm.errors.email}
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
            right={
              <TextInput.Icon
                onPress={() => setSecureTextEntry((value) => !value)}
                forceTextInputFocus={false}
                icon={secureTextEntry ? "eye-outline" : "eye-off-outline"}
              />
            }
            label={t("login.password")}
            error={signinForm.touched.password && !!signinForm.errors.password}
            value={signinForm.values.password}
            onChangeText={signinForm.handleChange("password")}
            onBlur={signinForm.handleBlur("password")}
          />
          {signinForm.touched.password && !!signinForm.errors.password && (
            <HelperText
              style={{
                position: "absolute",
                bottom: -25,
              }}
              type="error"
            >
              {signinForm.errors.password}
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
              signinForm.touched.confirmPassword &&
              !!signinForm.errors.confirmPassword
            }
            value={signinForm.values.confirmPassword}
            onChangeText={signinForm.handleChange("confirmPassword")}
            onBlur={signinForm.handleBlur("confirmPassword")}
          />
          {signinForm.touched.confirmPassword &&
            !!signinForm.errors.confirmPassword && (
              <HelperText
                style={{
                  position: "absolute",
                  bottom: -25,
                }}
                type="error"
              >
                {signinForm.errors.confirmPassword}
              </HelperText>
            )}
        </View>
        <Button
          disabled={!signinForm.isValid || signinForm.isSubmitting}
          onPress={() => signinForm.handleSubmit()}
          mode="contained-tonal"
        >
          {t("signin.confirmButton")}
        </Button>
      </View>
    </ScrollView>
  );
}

export { SigninPage };
