import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MessageListDrawer } from "../MessageList/MessageListDrawer";
import { SettingsPage } from "../SettingsPage/SettingsPage";
import { FriendsDrawer } from "../FriendsPage/FriendsDrawer";
import { OwnPage } from "../OwnPage/OwnPage";
import { Icon } from "react-native-paper";
import { NewsPage } from "../NewsPage/NewsPage";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { PRESENT, USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { realTimeDB } from "../../firebase/auth";
import { ref, set } from "firebase/database";
import { serverTimestamp } from "firebase/database";

const Tab = createBottomTabNavigator();


const setIsUserOnline = async (userId: string, isOnline: boolean) => {
  try {
    set(ref(realTimeDB, `${USERS_D}/${userId}/${PRESENT}`), {
      isOnline,
      lastVisit: serverTimestamp(),
    });
  } catch (error) {
    console.log(error.message);
  }
};

function HomePage() {
  const authUser = useAuthUser()
   useEffect(() => {
     setIsUserOnline(authUser.uid, true);
     return () => {
       setIsUserOnline(authUser.uid, false);
     };
   }, []);

  return (
    <Tab.Navigator
      initialRouteName="OwnPage"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let firstColor = "#f7f7f7";
          let secondColor = "#3b5998";

          if (route.name === "OwnPage") {
            iconName = "account-box";
          } else if (route.name === "Settings") {
            iconName = "tune";
          } else if (route.name === "News") {
            iconName = "newspaper-variant";
          } else if (route.name === "Friends") {
            iconName = "account-group";
          } else if (route.name === "Message") {
            iconName = "message";
          }

          return (
            <View
              style={{
                backgroundColor: focused ? secondColor : firstColor,
                padding: 5,
                borderRadius: 10,
              }}
            >
              <Icon
                source={iconName}
                size={30}
                color={focused ? firstColor : secondColor}
              />
            </View>
          );
        },
        tabBarLabelStyle: { display: "none" },
        headerShown: false,
      })}
    >
      <Tab.Screen name="OwnPage" component={OwnPage} initialParams={{userId: authUser.uid}}/>
      <Tab.Screen name="Message" component={MessageListDrawer} />
      <Tab.Screen name="News" component={NewsPage} />
      <Tab.Screen name="Friends" component={FriendsDrawer} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

export { HomePage };
