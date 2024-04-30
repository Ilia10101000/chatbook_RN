import { User } from "firebase/auth";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Pressable, ScrollView } from "react-native";
import {
  deleteUserPhoto,
  saveImage,
  changeUserName,
} from "../../firebase/util/settings";
import * as ImagePicker from "expo-image-picker";
import {
  TextInput,
  HelperText,
  FAB,
  Text,
  Button,
  Portal,
  Dialog,
  useTheme,
} from "react-native-paper";
import { UserAvatar } from "../CustomeComponent/UserAvatar";
import { useNavigation } from "@react-navigation/native";

function PersonalData({ user, handleError }: { user: User, handleError: (message: string | '') => void }) {
  const theme = useTheme();
  const navigation = useNavigation()
  const resetPage = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Settings" as never }],
    });
  }
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { t } = useTranslation();
  const displayNameForm = useFormik({
    initialValues: {
      displayName: user.displayName || 'Noname',
    },
    validate: ({displayName})=> {
      const errors: {
        displayName?: string;
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
      return errors
    },
    onSubmit: async ({ displayName }) => {
      try {
        await changeUserName(displayName, user);
      } catch (error) {
        handleError(error.message);
      }
    },
  });

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        handleSaveUserAvatar(result.assets[0].uri);
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleDeleteUserAvatar = async () => {
    try {
      await deleteUserPhoto(user);
    } catch (error) {
      handleError(error.message);
    } finally {
      setShowDeleteDialog(false)
    }
  }
  async function handleSaveUserAvatar(fsPhotoURL: string) {
    try {
      await saveImage(fsPhotoURL, user);
    } catch (error) {
      handleError(error.message);
    } finally {
      resetPage()
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{ height: '98%', alignItems: "center",paddingTop:20  }}
    >
      <View style={{ marginBottom: 20 }}>
        {user.photoURL ? (
          <View>
            <UserAvatar
              photoURL={user.photoURL}
              displayName={user.displayName}
              size={200}
            />
            <FAB
              icon="trash-can"
              style={{
                position: "absolute",
                top: 5,
                right: -30,
                backgroundColor: theme.colors.primary,
              }}
              onPress={() => setShowDeleteDialog(true)}
              size="small"
              color={theme.colors.onPrimary}
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
      </View>
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={{
            width: 250,
          }}
          mode="outlined"
          error={
            displayNameForm.touched.displayName &&
            !!displayNameForm.errors.displayName
          }
          label={t("login.name")}
          value={displayNameForm.values.displayName}
          onEndEditing={(e) => {
            displayNameForm.setFieldValue(
              "displayName",
              e.nativeEvent.text.trim().replace(/\s{2,}/g, " ")
            );
          }}
          onChangeText={displayNameForm.handleChange("displayName")}
          onBlur={displayNameForm.handleBlur("displayName")}
        />
        {displayNameForm.touched.displayName &&
          !!displayNameForm.errors.displayName && (
            <HelperText
              style={{
                position: "absolute",
                bottom: -25,
              }}
              type="error"
            >
              {displayNameForm.errors.displayName}
            </HelperText>
          )}
      </View>
      <Button
        disabled={
          (displayNameForm.isValid &&
            displayNameForm.values.displayName
              .trim()
              .replace(/\s{2,}/g, " ") === user.displayName) ||
          displayNameForm.isSubmitting
        }
        onPress={() => displayNameForm.handleSubmit()}
        buttonColor="#dfe3ee"
        textColor="#3b5998"
      >
        {t("login.change")}
      </Button>
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>{t("imageModal.confirmDelete")}</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>
              {t("login.cancel")}
            </Button>
            <Button onPress={handleDeleteUserAvatar}>
              {t("login.delete")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

export { PersonalData };
