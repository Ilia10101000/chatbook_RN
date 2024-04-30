import React, { useState } from "react";
import {
  View,
  TouchableHighlight,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import { List } from "react-native-paper";
import { CustomeTabComponent } from "../OwnPage/CustomeTabComponent";
import { useTranslation } from "react-i18next";
import { RequestItem } from "./RequestItem";
import { acceptFriendRequest, cancelFriendRequest } from "../../firebase/util/ContactButton";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";
import { useNavigation } from "@react-navigation/native";

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
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const handlePress = () => setExpanded(expanded => !expanded);

  const goToUserPage = (userId: string) => {
    //@ts-ignore
    navigation.navigate('UserPage', {userId})
  };
    
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
      <View style={{marginBottom:20}}>
      <List.Accordion
        expanded={expanded}
        onPress={handlePress}
        title={page === "0" ? t("friendsPage.received") : t("friendsPage.sent")}
      >
        <List.Item
          onPress={() => {
            handlePress()
            setPage("0")
          }}
          title={t("friendsPage.received")}
        />
        <List.Item onPress={() => {
          handlePress()
          setPage("1")
          }} title={t("friendsPage.sent")} />
      </List.Accordion>

      </View>

      <CustomeTabComponent index="0" value={page}>
        <FlatList
          data={receivedFriendsRequest}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestItem
              handleButtonPress={() => handleAcceptFriendsRequest(item.id)}
              userId={item.id}
              handleItemPress={goToUserPage}
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
              handleButtonPress={() => handleCancelFriendsRequest(item.id)}
              icon={"cancel"}
              userId={item.id}
              handleItemPress={goToUserPage}
            />
          )}
        />
      </CustomeTabComponent>
    </View>
  );
}

export { FriendsRequests };
