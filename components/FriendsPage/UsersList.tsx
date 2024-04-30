import React, { useState } from "react";
import { View, TouchableHighlight } from "react-native";
import { CustomeTabComponent } from "../OwnPage/CustomeTabComponent";
import { Text, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { FriendsList } from "./FriendsList";
import { FriendsRequests } from "./FriendsRequests";

type UserList = {id:string}

interface IUsersList {
  friendsList: Array<UserList>;
  sentFriendsList: Array<UserList>;
  receivedFriendsRequest: Array<UserList>;
}

function UsersList({
  friendsList,
  sentFriendsList,
  receivedFriendsRequest,
}: IUsersList) {
  const theme = useTheme()
  const [page, setPage] = useState("0");
  const { t } = useTranslation();

  const buttons = [
    {
      value: "0",
      label: t("drawerInner.friends"),
    },
    {
      value: "1",
      label: t("friendsPage.request"),
    },
  ];

  return (
    <View>
      <View
        style={{
          marginBottom: 10,
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
            <Text style={{ color: theme.colors.onPrimary }}>{item.label}</Text>
          </TouchableHighlight>
        ))}
      </View>
      <CustomeTabComponent index="0" value={page}>
        <FriendsList friendsList={friendsList} />
      </CustomeTabComponent>
      <CustomeTabComponent index="1" value={page}>
        <FriendsRequests
          receivedFriendsRequest={receivedFriendsRequest}
          sentFriendsList={sentFriendsList}
        />
      </CustomeTabComponent>
    </View>
  );
}

export { UsersList };
