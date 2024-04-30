import React, { createContext, useEffect } from "react";
import { PaperProvider, Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ParamListBase,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { LogBox, StatusBar } from "react-native";
import { HomePage } from "./components/HomePage/HomePage";
import { LoginPage } from "./components/LoginPage/LoginPage";
import { SigninPage } from "./components/SigninPage/SigninPage";
import { User } from "firebase/auth";
import "./i18n";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { ChatPage } from "./components/ChatPage/ChatPage";
import { HeaderTitle } from "./components/ChatPage/HeaderTitle";
import { PreferencesContext } from "./Preferences";
import { adaptNavigationTheme } from "react-native-paper";
import { lightTheme, darkTheme } from "./theme";
import merge from "deepmerge";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPage } from "./components/UserPage/UserPage";
import { MiddlewareCheckComponent } from "./firebase/util/MiddlewareCheckComponent";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, lightTheme);
const CombinedDarkTheme = merge(DarkTheme, darkTheme);

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
    name: "MiddlewareChecking",
    component: MiddlewareCheckComponent,
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
  {
    name: "UserPage",
    component: UserPage,
    options: ({ route, navigation }: any) => {
      return {
        headerShown: true,
        title:''
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
      title: "",
    },
  },
];

const getThemePreferences = async () => {
  const theme = await AsyncStorage.getItem("theme");
  return theme || null;
};

const setThemePreferences = async (isDark: boolean) => {
  await AsyncStorage.setItem("theme", isDark ? "dark" : "light");
};

export default function App() {
  const [authUser, loading, error] = useAuthState(auth);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  let theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(async () => {
    await setThemePreferences(!isDarkTheme);
    setIsDarkTheme((value) => !value);
  }, [isDarkTheme]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isDarkTheme,
    }),
    [toggleTheme, isDarkTheme]
  );
  useEffect(() => {
    const setStorageThemeMode = async () => {
      const mode = await getThemePreferences();
      if (mode && mode == "dark") {
        setIsDarkTheme(true);
      }
    };
    setStorageThemeMode();
  }, []);

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
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={theme}>
          <StatusBar
            backgroundColor={isDarkTheme ? "#000" : "#fff"}
            barStyle={isDarkTheme ? "light-content" : "dark-content"}
          />
          <NavigationContainer theme={theme}>
            <SafeAreaView
              style={{
                flex: 1,
              }}
            >
              <Stack.Navigator id={'RootStack'} initialRouteName={initialRouteName}>
                {screens.map(({ name, component, options }) => (
                  <Stack.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={options}
                  />
                ))}
              </Stack.Navigator>
            </SafeAreaView>
          </NavigationContainer>
        </PaperProvider>
      </PreferencesContext.Provider>
    </AuthUserContext.Provider>
  );
}
