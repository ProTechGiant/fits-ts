import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Image,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Platform,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Images from "../../constants/Images";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { url } from "../../constants/url";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const WalletForTrainee = ({ navigation }) => {
  // Hooks
  const [load, setLoad] = useState(false);
  const [cardData, setCardData] = useState();
  const [addBalance, setAddBalance] = useState();
  // Functions

  const userMe = async () => {
    setLoad(true);
    const userData = await AsyncStorage.getItem("userData");
    let userDatax = JSON.parse(userData);
    if (userDatax) {
      await fetch(`${url}/user/me/${userDatax?.data?._id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDatax?.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((res2) => {
          if (res2?.success) {
            getStripeCard(res2?.stripe?.card?.customer);
            setAddBalance(res2?.stripe?.card);
          } else {
            Toast.show({
              type: "error",
              text1: "Something went wrong!",
            });
          }
        })
        .catch(() => {
          setLoad(false);
          Toast.show({
            type: "error",
            text1: "Something went wrong!",
          });
        });
    }
  };

  const getStripeCard = async (id) => {
    setLoad(true);
    const userData = await AsyncStorage.getItem("userData");
    let userDatax = JSON.parse(userData);
    if (userDatax) {
      await fetch(`${url}/stripe/customer/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDatax?.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((res2) => {
          setLoad(false);

          console.log(
            "================================================",
            res2,
            "================================================"
          );
          if (res2?.message === "Stripe Customer Found Successfully!") {
            Toast.show({
              type: "success",
              text1: "Balance successfully updated",
            });
            setCardData(res2?.data);
          } else {
            Toast.show({
              type: "error",
              text1: "Something went wrong",
            });
          }
        })
        .catch(() => {
          setLoad(false);
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        });
    }
  };

  const callRecharge = async (amount) => {
    setLoad(true);
    const userTokendata = await AsyncStorage.getItem("userData");
    let userTokendatax = JSON.parse(userTokendata);
    if (userTokendatax) {
      await fetch(`${url}/stripe/recharge/${addBalance?.customer}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userTokendatax?.access_token}`,
        },
        body: JSON.stringify({
          amount: amount,
          currency: "USD",
          source: addBalance?.id,
          description: "Recharge Account",
        }),
      })
        .then((res) => res.json())
        .then((res2) => {
          userMe();
          setLoad(true);
        })
        .catch(() => {
          setLoad(false);
          Toast.show({
            type: "error",
            text1: "Something went wrong!",
          });
        });
    }
  };

  // Effects
  useEffect(() => {
    navigation.addListener("focus", () => {
      userMe();
    });
  }, []);
  return (
    <View style={styles.container}>
      <Header
        label={"Wallet"}
        subLabel={"Add cash to your account by selecting any plan."}
        navigation={navigation}
        doubleHeader={true}
      />

      {/*End Header*/}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
        {load ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <>
            <View
              style={{
                width: "90%",
                marginTop: 10,
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <View style={styles.Totalblcview}>
                <Text style={styles.totalTextstyle}>Total balance</Text>
              </View>
              <View style={styles.moneyview}>
                <Text style={styles.moneyTextstyle}>$ {cardData?.balance}</Text>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                marginTop: 10,
                marginBottom: 10,
                alignSelf: "center",
              }}
            >
              <Text style={styles.SelectText}>Select Wallet Top Up Amount</Text>
            </View>
            <View style={styles.TopView}>
              <View style={styles.topView}>
                {/*start Box View*/}
                <View style={styles.FlexView}>
                  {/*start left box*/}
                  <TouchableOpacity
                    onPress={() => {
                      callRecharge(30);
                    }}
                    activeOpacity={0.8}
                    style={styles.Totalblcview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>$ 30</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end left box*/}
                  {/*start right box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.moneyview}
                    onPress={() => {
                      callRecharge(60);
                    }}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 60</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end right box*/}
                </View>
                {/*start Box View*/}
                {/*start Box View*/}
                <View style={styles.FlexView}>
                  {/*start left box*/}
                  <TouchableOpacity
                    onPress={() => {
                      callRecharge(100);
                    }}
                    activeOpacity={0.8}
                    style={styles.Totalblcview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 100</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end left box*/}
                  {/*start right box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      callRecharge(130);
                    }}
                    style={styles.moneyview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 130</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end right box*/}
                </View>
                {/*start Box View*/}
                {/*start Box View*/}
                {/*start Box View*/}
                <View style={styles.FlexView}>
                  {/*start left box*/}
                  <TouchableOpacity
                    onPress={() => {
                      callRecharge(150);
                    }}
                    activeOpacity={0.8}
                    style={styles.Totalblcview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 150</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end left box*/}
                  {/*start right box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      callRecharge(170);
                    }}
                    style={styles.moneyview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 170</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end right box*/}
                </View>
                {/*start Box View*/}
                {/*start Box View*/}
                {/*start Box View*/}
                <View style={styles.FlexView}>
                  {/*start left box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      callRecharge(200);
                    }}
                    style={styles.Totalblcview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 200</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end left box*/}
                  {/*start right box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      callRecharge(230);
                    }}
                    style={styles.moneyview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 230</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end right box*/}
                </View>
                {/*start Box View*/}
                {/*start Box View*/}
                {/*start Box View*/}
                <View style={styles.FlexView}>
                  {/*start left box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      callRecharge(260);
                    }}
                    style={styles.Totalblcview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 260</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end left box*/}
                  {/*start right box*/}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      callRecharge(300);
                    }}
                    style={styles.moneyview}
                  >
                    <View style={styles.boxView}>
                      <View style={styles.topView}>
                        <View style={styles.FlexboxView}>
                          <View style={styles.Totalblcview}>
                            <Text style={styles.BoxText}>Add</Text>
                          </View>
                          <View style={styles.moneyview}>
                            <Text style={styles.BoxText}>${""} 300</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/*end right box*/}
                </View>
                {/*start Box View*/}
              </View>
            </View>
          </>
        )}
        <View style={{ paddingVertical: 40 }}></View>
      </ScrollView>
      {/*start Add btn*/}
      {/* <View style={styles.footer}>
        <Button navigation={navigation} label={"book Wallet"} disabled={load} />
      </View> */}
      {/*End Add btn*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 40 : 0,
    paddingBottom: Platform.OS === "ios" ? 0 : 0,
  },
  header: {
    width: "100%",
    height: 250,
    // borderWidth:1
  },
  fixeheight: {
    height: 50,
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey",
    width: "100%",
    alignItems: "center",
  },
  fixeheight1: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    // alignItems:'center',
  },
  main: {
    width: "100%",
  },
  footer: {
    width: "100%",
    marginBottom: 20,
    bottom: 0,
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#fff",
    // borderWidth:1,
  },
  TopView: {
    width: "100%",
    alignItems: "center",
  },
  topView: { width: "90%" },
  topView1: {
    width: "90%",
    alignItems: "center",
  },
  WalletText: {
    fontFamily: "Poppins-Bold",
    fontSize: RFValue(19, 580),
    color: "#000",
  },
  AddCashText: {
    fontFamily: "Poppins-Regular",
    fontSize: RFValue(13, 580),
    color: "#ABABB5",
  },
  FlexView: {
    width: "100%",
    flexDirection: "row",
    marginTop: 15,
  },
  Totalblcview: {
    width: "50%",
  },
  moneyview: {
    width: "50%",
    alignItems: "flex-end",
  },
  totalTextstyle: {
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    lineHeight: 28,
    fontSize: RFValue(15, 580),
  },
  moneyTextstyle: {
    fontFamily: "Poppins-Regular",
    color: "#000",
    lineHeight: 28,
    fontSize: RFValue(15, 580),
  },
  SelectText: {
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    fontSize: RFValue(13, 580),
    fontStyle: "normal",
  },
  selectView: {
    marginTop: 30,
  },
  boxView: {
    width: 149,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  BoxText: {
    color: "#fff",
  },
  FlexboxView: {
    width: "100%",
    flexDirection: "row",
  },
  btn: {
    padding: 10,
    margin: 10,
    width: "90%",
    borderRadius: 10,
    color: "#6698FF",
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WalletForTrainee;