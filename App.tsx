import React, { createContext } from "react";
import { PaperProvider, Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { LogBox } from "react-native";
import { HomePage } from "./components/HomePage/HomePage";
import { LoginPage } from "./components/LoginPage/LoginPage";
import { SigninPage } from "./components/SigninPage/SigninPage";
import { User } from "firebase/auth";
import "./i18n";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { ChatPage } from "./components/ChatPage/ChatPage";
import { HeaderTitle } from "./components/ChatPage/HeaderTitle";

const Stack = createNativeStackNavigator();
export const AuthUserContext = createContext<User>(null);
LogBox.ignoreLogs(["Require cycle"]);

type OptionsType =
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, any>;
      navigation: any;
    }) => NativeStackNavigationOptions);

type OptionsParams = {
  name: string;
  component: any;
  options: OptionsType;
};

const authorizedScreens: Array<OptionsParams> = [
  {
    name: "HomePage",
    component: HomePage,
    options: {
      headerShown: false,
    },
  },
  {
    name: "ChatPage",
    component: ChatPage,
    options: ({ route, navigation }: any) => {
      return {
        headerShown: true,
        headerTitle: () => (
          <HeaderTitle
            displayName={route.params.user.displayName}
            photoURL={route.params.user.photoURL}
            userId={route.params.user.id}
          />
        ),
      };
    },
  },
];
const unAuthorizedScreens = [
  {
    name: "LoginPage",
    component: LoginPage,
    options: {
      headerShown: false,
    },
  },
  {
    name: "SigninPage",
    component: SigninPage,
    options: {
      headerShown: true,
      title:''
    },
  },
];

export default function App() {
  const [authUser, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" animating={true} color={"#3b5998"} />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Some error occured. Try again</Text>
      </SafeAreaView>
    );
  }

  const initialRouteName = authUser ? "HomePage" : "LoginPage";

  const screens = authUser ? authorizedScreens : unAuthorizedScreens;

  return (
    <AuthUserContext.Provider value={authUser}>
      <PaperProvider>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName}>
              {screens.map(({ name, component, options }) => (
                <Stack.Screen
                  key={name}
                  name={name}
                  component={component}
                  options={options}
                />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </AuthUserContext.Provider>
  );
}
