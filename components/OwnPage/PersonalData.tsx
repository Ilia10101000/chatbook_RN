import React, { useState } from "react";
import { View } from "react-native";
import { Text, Menu, Divider, FAB, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "../CustomeComponent/UserAvatar";
import { useContactButton } from "../../firebase/util/ContactButton";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";
import { DocumentData } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

function PersonalData({
  user,
  isOwnPage = true,
}: {
  user: DocumentData;
  isOwnPage?: boolean;
}) {
  const { t } = useTranslation();
  const authUser = useAuthUser();
  const theme = useTheme();
  const navigation = useNavigation()
  const { error, setError } = useErrorAlert();
  const [visible, setVisible] = React.useState(false);

  const contactButton = useContactButton({
    authUser: authUser,
    userId: user.id,
    handleError: setError,
  });

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 20,
        overflow: "hidden",
      }}
    >
      <UserAvatar
        photoURL={user.photoURL}
        displayName={user.displayName}
        size={140}
      />
      <View
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          gap: 10,
        }}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" variant="headlineSmall">
          {user.displayName || "No name"}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" variant="titleMedium">
          {t("userPage.publications")}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" variant="titleMedium">
          {t("userPage.friends")}
        </Text>
        {!isOwnPage && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <FAB
                icon="dots-horizontal"
                style={{ alignSelf: "flex-start", backgroundColor:theme.colors.primary }}
                size="small"
                onPress={openMenu}
              />
            }
          >
            <Menu.Item
              leadingIcon={"android-messages"}
              onPress={() => {
                closeMenu();
                //@ts-ignore
                navigation.navigate("MiddlewareChecking", { user });
              }}
              title={t("userPage.startChat")}
            />
            <Divider />
            {contactButton.disabled ? (
              <Menu.Item
                leadingIcon={"dots-horizontal"}
                title={t("contactButton.processing")}
              />
            ) : (
              <Menu.Item
                leadingIcon={contactButton.icon}
                title={contactButton.label}
                onPress={contactButton.onPress}
              />
            )}
          </Menu>
        )}
      </View>
    </View>
  );
}

export { PersonalData };
