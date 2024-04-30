import React, { useState } from "react";
import { Text, useTheme, Icon } from "react-native-paper";
import { View, TouchableHighlight } from "react-native";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { useTranslation } from "react-i18next";
import { CustomeTabComponent } from "../OwnPage/CustomeTabComponent";
import { PersonalData } from "./PersonalData";
import { Theme } from "./Theme";
import { Security } from "./Security";
import { Account } from "./Account";
import { ErrorAlert, useErrorAlert } from "../CustomeComponent/useErrorAlert";

function SettingsPage() {
  const [page, setPage] = useState("0");
  const theme = useTheme()
  const authUser = useAuthUser();
  const { t } = useTranslation();
  const { error, setError } = useErrorAlert();
  const buttons = [
    {
      value: "0",
      label: "information-outline",
    },
    {
      value: "1",
      label: "theme-light-dark",
    },
    {
      value: "2",
      label: "lock",
    },
    {
      value: "3",
      label: "account",
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {buttons.map((item) => (
          <TouchableHighlight
            key={item.value}
            underlayColor="transparent"
            onPress={() => setPage(item.value)}
            style={{
              flexGrow: 1,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                item.value === page
                  ? theme.colors.primary
                  : theme.colors.secondary,
            }}
          >
            <Icon color='#fff' source={item.label} size={25} />
          </TouchableHighlight>
        ))}
      </View>
      <CustomeTabComponent index="0" value={page}>
        <PersonalData handleError={() => setError("")} user={authUser} />
      </CustomeTabComponent>
      <CustomeTabComponent index="1" value={page}>
        <Theme />
      </CustomeTabComponent>
      <CustomeTabComponent index="2" value={page}>
        <Security
          handleError={(message = "") => setError(message)}
          user={authUser}
        />
      </CustomeTabComponent>
      <CustomeTabComponent index="3" value={page}>
        <Account
          user={authUser}
          handleError={(message = "") => setError(message)}
        />
      </CustomeTabComponent>
      <ErrorAlert
        visible={error}
        handleClose={() => setError("")}
        message={error}
      />
    </View>
  );
}

export { SettingsPage };
