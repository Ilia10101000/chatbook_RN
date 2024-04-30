import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { FlatList, View, ActivityIndicator, ScrollView } from "react-native";
import { FriendsListItem } from "./FriendsListItem";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { useNavigation } from "@react-navigation/native";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { db } from "../../firebase/auth";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";
import { Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

interface IFriendsList {
  friendsList: Array<{ id: string }>;
}

function FriendsList({ friendsList }: IFriendsList) {
  const authUser = useAuthUser();
  const [usersSearchValue, setUsersSearchValue] = useState("");
  const [textValue] = useDebounce(usersSearchValue, 800);
  const [resultUserSearch, setResultUserSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useErrorAlert();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const fetchData = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      try {
        const queryRef = query(
          collection(db, USERS_D),
          where("searchQuery", ">=", searchQuery.toLowerCase()),
          where("searchQuery", "<=", searchQuery.toLowerCase() + "\uf8ff"),
          limit(10)
        );
        const data = await getDocs(queryRef);
        const resultList = data.docs.map((doc) => doc.data());
        const result = resultList.filter(
          (user) => user.id !== authUser.uid || !friendsList.includes(user.id)
        );
        setResultUserSearch(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  ); 

  const goToUserPage = (userId: string) => {
    //@ts-ignore
    navigation.navigate('UserPage', {userId}) 
  }

  useEffect(() => {
    if (textValue) {
      fetchData(textValue);
    } else if (!textValue && resultUserSearch) {
      setResultUserSearch(null);
    }
  }, [textValue]);

  let result;

  let noResult = (
    <Text style={{ textAlign: "center" }}>
      {resultUserSearch ? t("userPage.noMatches") : t("friendsPage.find")}
    </Text>
  );
  let dataList = resultUserSearch ? resultUserSearch : friendsList;

  if (!dataList?.length) {
    result = noResult;
  } else {
    result = (
      <FlatList
        data={dataList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendsListItem handlePress={goToUserPage} userId={item.id} />
        )}
      />
    );
  }

  return (
    <View>
      <TextInput
        left={<TextInput.Icon icon={"account-search-outline"} />}
        style={{
          width: "100%",
          marginBottom: 20,
          marginTop: 10,
        }}
        value={usersSearchValue}
        activeUnderlineColor="#3b5998"
        placeholder={t("friendsPage.findFriends")}
        onChangeText={setUsersSearchValue}
      />
      {loading ? (
        <View>
          <ActivityIndicator animating={true} color="#8b9dc3" size={20} />
        </View>
      ) : (
        result
      )}
    </View>
  );
}

export { FriendsList };
