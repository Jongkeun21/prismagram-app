import React, { useState, useEffect } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import Loader from "../../components/Loader";
import constants from "../../constants";

const View = styled.View`flex: 1;`;

const Text = styled.Text``;

const Div = styled.View``;

export default () => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState();
  const [allPhotos, setAllPhotos] = useState();
  const changeSelected = photo => {
    setSelected(photo);
  };
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
      // console.log(photos);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        setHasPermission(true);
        getPhotos();
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
        : <View>
            {hasPermission
              ? <Div>
                  <Image
                    style={{
                      width: constants.width,
                      height: constants.height / 2
                    }}
                    source={{ uri: selected.uri }}
                  />
                  <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
                    {allPhotos.map(photo =>
                      <TouchableOpacity
                        key={photo.id}
                        onPress={() => changeSelected(photo)}
                      >
                        <Image
                          source={{ uri: photo.uri }}
                          style={{
                            width: constants.width / 3,
                            height: constants.height / 6,
                            opacity: photo.id === selected.id ? 0.5 : 1
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </Div>
              : null}
          </View>}
    </View>
  );
};
