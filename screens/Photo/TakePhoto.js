import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import styled from "styled-components";
import { Camera } from "expo-camera";
import Loader from "../../components/Loader";
import constants from "../../constants";
const View = styled.View`flex: 1;`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        setHasPermission(true);
      }
      // console.log(permission);
    } catch (error) {
      console.log(error);
      hasPermission(false);
    }
  };
  useEffect(() => {
    askPermission();
  }, []);

  return (
    <View>
      {loading
        ? <Loader />
        : hasPermission
          ? <Camera
              style={{ width: constants.width, height: constants.height / 2 }}
            />
          : null}
    </View>
  );
};
