import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { TouchableOpacity, View, AsyncStorage, Text } from "react-native";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "react-apollo-hooks";
import options from "./apollo";
import styles from "./styles";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const preLoad = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font
      });
      await Asset.loadAsync([require("./assets/Instagram.png")]);
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      const client = new ApolloClient({
        cache,
        ...options
      });
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoaded(true);
      setClient(client);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);

  const logUserIn = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  return loaded && client && isLoggedIn !== null
    ? <ApolloProvider client={client}>
        <ThemeProvider theme={styles}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {isLoggedIn === true
              ? <TouchableOpacity onPress={logUserOut}>
                  <Text>Log out</Text>
                </TouchableOpacity>
              : <TouchableOpacity onPress={logUserIn}>
                  <Text>Log in</Text>
                </TouchableOpacity>}
          </View>
        </ThemeProvider>
      </ApolloProvider>
    : <AppLoading />;
}
