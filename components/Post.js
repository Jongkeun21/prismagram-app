import React, { useState } from "react";
import { Image } from "react-native";
import styled from "styled-components";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../constants";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";

export const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

const Container = styled.View``;
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
const HeaderUserContainer = styled.View`margin-left: 10px;`;
const Bold = styled.Text`font-weight: 500;`;
const Location = styled.Text`font-size: 12px;`;
const IconsContainer = styled.View`
  margin-bottom: 5px;
  flex-direction: row;
`;
const IconContainer = styled.View`margin-right: 5px;`;
const InfoContainer = styled.View`padding: 10px;`;
const Caption = styled.Text`margin: 3px 0px;`;
const CommetCount = styled.Text`
  opacity: 0.5;
  font-size: 12px;
`;

const Post = ({
  id,
  user,
  location,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments = [],
  isLiked: isLikedProp,
  navigation
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const toggleLikeMutation = useMutation(TOGGLE_LIKE, {
    variables: { postId: id }
  });
  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount(l => l - 1);
    } else {
      setLikeCount(l => l + 1);
    }
    setIsLiked(p => !p);
    try {
      await toggleLikeMutation();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Header>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })}
        >
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{ uri: user.avatar }}
          />
        </Touchable>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })}
        >
          <HeaderUserContainer>
            <Bold>
              {user.username}
            </Bold>
            <Location>
              {location}
            </Location>
          </HeaderUserContainer>
        </Touchable>
      </Header>
      <Swiper
        style={{ height: constants.height / 2.5 }}
        loop={false}
        showsPagination={false}
      >
        {files.map(file =>
          <Image
            style={{ width: constants.width, height: constants.height / 2.5 }}
            key={file.id}
            source={{ uri: file.url }}
          />
        )}
      </Swiper>
      <InfoContainer>
        <IconsContainer>
          <Touchable onPress={handleLike}>
            <IconContainer>
              <Ionicons
                size={28}
                color={isLiked ? styles.redColor : styles.blackColor}
                name={isLiked ? "md-heart" : "md-heart-empty"}
              />
            </IconContainer>
          </Touchable>
          <Touchable>
            <IconContainer>
              <FontAwesome size={24} name={"comment-o"} />
            </IconContainer>
          </Touchable>
        </IconsContainer>
        <Touchable>
          <Bold>
            {likeCount === 1 ? "1 like" : `${likeCount} likes`}
          </Bold>
        </Touchable>
        <Caption>
          <Bold>{user.username}</Bold> {caption}
        </Caption>
        <Touchable>
          <CommetCount>
            See all {comments.length} comments
          </CommetCount>
        </Touchable>
      </InfoContainer>
    </Container>
  );
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
};

export default withNavigation(Post);
