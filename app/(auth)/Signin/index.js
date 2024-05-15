import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useToast } from "native-base";
import React, { useRef } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import AuthScreen from "../../../components/global/AuthScreen";
import Button from "../../../components/global/Button";
import DismissKeyboardView from "../../../components/global/HideKeyboard";
import { getRespValue } from "../../../design/desin";
import { renderToastError, renderToastSuccess } from "../../../hooks/useToasty";
import { useSigninMutation } from "../../../store/api/signinApi";
import { selectUser } from "../../../store/selectors/userSelect";
import { setAuthState } from "../../../store/slices/userSlice";
export default function Signin() {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { accessToken } = useSelector(selectUser);
  const dispatch = useDispatch();
  console.log("signin Token", accessToken);
  console.log("email:", emailRef.current);
  console.log("password:", passwordRef.current);
  const toast = useToast();

  const [signin, { isLoading }] = useSigninMutation();
  const handleUpload = async () => {
    Keyboard.dismiss();
    try {
      const res = await signin({
        email: emailRef.current,
        password: passwordRef.current,
      }).unwrap();
      console.log("res", res?.results?.token);
      dispatch(setAuthState({ accessTokens: res?.results?.token }));
      router.replace("(main)/Home");
      renderToastSuccess(res?.message || "SignIn Successfully", toast);
    } catch (error) {
      console.log("email:", emailRef.current);
      console.log("password:", passwordRef.current);
      console.log("SignInOtpError", error);
      renderToastError(error?.data?.message || "Something went wrong", toast);
    }
  };
  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please enter all fields");
      return;
    }
    console.log("thiiddsa");
    handleUpload();
    //login process
  };
  return (
    <AuthScreen title='SignIn' topColor='white'>
      {/* <ScrollView> */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          // flexGrow: 1,
          paddingBottom: Platform.OS === "ios" ? getRespValue(40) : 20,
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        scrollEnabled
        enableAutomaticScroll
        extraHeight={Platform.OS==="os"?getRespValue(80):getRespValue(100)}
      >
        <View style={{ paddingTop: 20, flex: 1 }}>
          <StatusBar style="dark" />
          <DismissKeyboardView>
            <View style={{ flex: 1, gap: 12, alignItems: "center" }}>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../../assets/images/login.png")}
                  style={styles.Logo}
                />
                <Text style={styles.signInTxt}>Sign In</Text>
              </View>
              <View style={styles.text}>
                <Octicons name="mail" size={getRespValue(30)} color="grey" />
                <TextInput
                  style={styles.txtInput}
                  onChangeText={(value) => (emailRef.current = value)}
                  placeholder="Enter your email"
                  placeholderTextColor="grey"
                />
              </View>
              <View style={styles.text}>
                <Octicons name="lock" size={getRespValue(30)} color="grey" />
                <TextInput
                  style={styles.txtInput}
                  onChangeText={(value) => (passwordRef.current = value)}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="grey"
                />
              </View>
              {/* <TouchableOpacity onPress={{}} style={{alignSelf:'flex-end',paddingRight:22}}>
          <Text style={styles.forgotTxt}>Forgot password?</Text>
          </TouchableOpacity> */}

              <Button
                buttonType="login"
                onPress={() => handleLogin()}
                loading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>

              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Text style={styles.forgotTxt}>Don't ave an account? </Text>
                <TouchableOpacity onPress={() => router.replace("Signup")}>
                  <Text style={{ color: "#36318D", fontSize: 12 }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
              <Button buttonType="back" onPress={() => router.replace("/")} />
            </View>
          </DismissKeyboardView>
        </View>
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
    </AuthScreen>
  );
}
export const styles = StyleSheet.create({
  txtInput: {
    width: "75%",
  },
  Logo: {
    width: getRespValue(450),
    height: getRespValue(350),
  },
  text: {
    gap: getRespValue(25),
    flexDirection: "row",
    width: "85%",
    alignSelf: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderColor: "grey",
    padding: 10,
  },
  signInTxt: {
    alignSelf: "center",
    marginTop: getRespValue(30),
      fontSize: 32, 
      fontWeight: 'bold', 
      color: 'orange', 
  },
  forgotTxt: {
    color: "grey",
    fontSize: getRespValue(16),
    fontWeight: "600",
  },
});
