import React, { useState } from "react";
import { View, TouchableHighlight, Text, FlatList } from "react-native";
import { CustomeTabComponent } from "../OwnPage/CustomeTabComponent";
import { useTranslation } from "react-i18next";
import { RequestItem } from "./RequestItem";
import { acceptFriendRequest, cancelFriendRequest } from "../../firebase/util/ContactButton";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";

type UserList = { id: string };

interface IUsersList {
  sentFriendsList: Array<UserList>;
  receivedFriendsRequest: Array<UserList>;
}

function FriendsRequests({
  sentFriendsList,
  receivedFriendsRequest,
}: IUsersList) {
  const [page, setPage] = useState("0");
    const { t } = useTranslation();
    const authUser = useAuthUser();
    const { error, setError } = useErrorAlert();

  const buttons = [
    {
      value: "0",
      label: t("friendsPage.received"),
    },
    {
      value: "1",
      label: t("friendsPage.sent"),
    },
    ];
    
    const handleAcceptFriendsRequest = async (userId: string) => {
        try {
            await acceptFriendRequest({user1Id:authUser.uid, user2Id:userId})
        } catch (error) {
            setError(error.message)
        }
    }

    const handleCancelFriendsRequest = async (userId: string) => {
        try {
            await cancelFriendRequest({user1Id:authUser.uid, user2Id:userId})
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 5,
          overflow: "hidden",
          marginBottom: 20,
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
              backgroundColor: item.value === page ? "#3b5998" : "#f7f7f7",
            }}
          >
            <Text style={{ color: item.value === page ? "#fff" : "#000" }}>
              {item.label}
            </Text>
          </TouchableHighlight>
        ))}
      </View>
      <CustomeTabComponent index="0" value={page}>
        <FlatList
          data={receivedFriendsRequest}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestItem
              handlePress={() => handleAcceptFriendsRequest(item.id)}
              userId={item.id}
            />
          )}
        />
      </CustomeTabComponent>
      <CustomeTabComponent index="1" value={page}>
        <FlatList
          data={sentFriendsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestItem
              handlePress={() => handleCancelFriendsRequest(item.id)}
              icon={"cancel"}
              userId={item.id}
            />
          )}
        />
      </CustomeTabComponent>
    </View>
  );
}

export { FriendsRequests };
