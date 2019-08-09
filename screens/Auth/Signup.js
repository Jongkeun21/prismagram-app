import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { CREATE_ACCOUNT } from "./AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const FacebookContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-color: ${props => props.theme.lightGreyColor};
  border-style: solid;
`;

const GoogleContainer = styled.View`
  margin-top: 5px;
  padding-top: 5px;
`;

export default ({ navigation }) => {
  const firstNameInput = useInput("");
  const lastNameInput = useInput("");
  const emailInput = useInput(navigation.getParam("email", ""));
  const usernameInput = useInput("");
  const [loading, setLoading] = useState(false);
  const createAccountMutation = useMutation(CREATE_ACCOUNT, {
    variables: {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      username: usernameInput.value
    }
  });

  const connectFacebook = () => {
    Alert.alert("Connecting Facebook is not possible");
  };

  const connectGoogle = () => {
    Alert.alert("Connecting Google account is not possible");
  };

  const handleSignup = async () => {
    const { value: firstName } = firstNameInput;
    const { value: lastName } = lastNameInput;
    const { value: email } = emailInput;
    const { value: username } = usernameInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("That email is invalid");
    }
    if (firstName === "") {
      return Alert.alert("I need your name");
    }
    if (username === "") {
      return Alert.alert("Invalid username");
    }
    try {
      setLoading(true);
      const { data: { createAccount } } = await createAccountMutation();
      if (createAccount) {
        Alert.alert("Account created", "Log in NOW!");
        navigation.navigate("Login", { email });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Username taken", "Log in instead");
      navigation.navigate("Login", { email });
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...firstNameInput}
          placeholder="First name"
          autoCapitalize="words"
        />
        <AuthInput
          {...lastNameInput}
          placeholder="Last name"
          autoCapitalize="words"
        />
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...usernameInput}
          placeholder="Username"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleSignup} text="Sign up" />
        <FacebookContainer>
          <AuthButton
            backgroundColor={"#2D4DA7"}
            loading={false}
            onPress={connectFacebook}
            text="Connect Facebook"
          />
        </FacebookContainer>
        <GoogleContainer>
          <AuthButton
            backgroundColor={"#EE1922"}
            loading={false}
            onPress={connectGoogle}
            text="Connect Google"
          />
        </GoogleContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};
