import React from "react";
import { View, Image } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import Home from "../screens/Tabs/Home";
import Notifications from "../screens/Tabs/Notifications";
import Profile from "../screens/Tabs/Profile";
import Detail from "../screens/Detail";
import Search from "../screens/Tabs/Search/SearchContainer";
import MessagesLink from "../components/MessagesLink";
import NavIcon from "../components/NavIcon";
import { stackStyles } from "./Config";
import styles from "../styles";
import UserDetail from "../screens/UserDetail";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig,
          headerStyle: { ...stackStyles }
        }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          title: "Photo"
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam("username")
        })
      }
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerTintColor: styles.blackColor,
        headerStyle: { ...stackStyles }
      }
    }
  );

export default createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(Home, {
        headerRight: <MessagesLink />,
        headerTitle: (
          <Image
            style={{ height: 35 }}
            resizeMode="contain"
            source={require("../assets/logo.png")}
          />
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon focused={focused} name="md-home" />
      }
    },
    Search: {
      screen: stackFactory(Search, {
        headerBaekTitle: null
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon focused={focused} name="md-search" />
      }
    },
    Add: {
      screen: View,
      navigationOptions: {
        tabBarOnPress: ({ navigation }) =>
          navigation.navigate("PhotoNavigation"),
        tabBarIcon: ({ focused }) =>
          <NavIcon focused={focused} name="md-add-circle-outline" size={30} />
      }
    },
    Notifications: {
      screen: stackFactory(Notifications, {
        title: "Notifications"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon
            focused={focused}
            name={focused ? "md-heart" : "md-heart-empty"}
          />
      }
    },
    Profile: {
      screen: stackFactory(Profile, {
        title: "Profile"
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon focused={focused} name="md-person" />
      }
    }
  },
  {
    initialRouteName: "Profile",
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#FAFAFA"
      }
    }
  }
);
