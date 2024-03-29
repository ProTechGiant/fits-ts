import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { NavigationSwitchProp } from "react-navigation";
import { useGetChatRoomsQuery } from "../../slice/FitsApi.slice";
import Typography from "../../Components/typography/text";
import Container from "../../Components/Container";
import Colors from "../../constants/Colors";
import useSocket from "../../hooks/use-socket";
import { useDispatch, useSelector } from "react-redux";
import { MessageInterface, UserDetail } from "../../interfaces";
import { MessageState, clearUnReadMessages } from "../../slice/messages.slice";
import { clearUnReadMessageFromAsyncStorage } from "../../utils/async-storage";
import Header from "../../Components/Header";
import TextInput from "../../Components/Input";

interface PropsInterface {
  navigation: NavigationSwitchProp;
}

const Chat = ({ navigation }: PropsInterface) => {
  const { data: getRoomsFromApi, refetch: refetchRooms } = useGetChatRoomsQuery({});
  const { userInfo } = useSelector((state: { fitsStore: Partial<UserDetail> }) => state.fitsStore);
  const [searchText, setSearchText] = useState("");
  const { activeUsers, socket } = useSocket(userInfo?.user?._id || '')
  const dispatch = useDispatch();
  const {unReadMessages} = useSelector((state: { messages: Partial<MessageState> }) => state.messages);

  useEffect(() => {
    socket.on("receive-message", () => {
      refetchRooms();
    });
  }, []);
  
    useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
        refetchRooms()
        clearUnReadMessageFromAsyncStorage()
        dispatch(clearUnReadMessages());
      });
      return () => {
        focusListener.remove()
      };
    }, [navigation, clearUnReadMessageFromAsyncStorage, refetchRooms]);

  const handlePressOnRoom = (item: RoomDataInterface) => {
    navigation.navigate("ChatBox", { roomId: item._id, linkedUser: item.linkedUser, status: !!activeUsers.some(user => user.userID === item.linkedUser.id) });
  };
  
  const filteredRooms = getRoomsFromApi?.data.filter((room: RoomDataInterface) =>
    room.linkedUser.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container>
      <Header label="Chat with others" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <TextInput isSearchBox placeholder="Search for chat..." value={searchText} onChangeText={setSearchText} label={"Search Chat"} />
          <View style={styles.topView}>
            {filteredRooms && filteredRooms.length === 0 ? (
              <View style={styles.noRoomsView}>
                <Typography>No rooms found</Typography>
              </View>
            ) : (
                filteredRooms?.map((item: RoomDataInterface) => {
                  return <TouchableOpacity
                    key={item._id}
                    style={styles.roomContainer}
                    onPress={() => handlePressOnRoom(item)}
                  >
                    <View style={styles.roomContent}>
                      <Image
                        style={styles.roomImage}
                        source={{ uri: item?.linkedUser.image }}
                      />
                      <View style={styles.roomTextContent}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {activeUsers.some(user => user.userID === item.linkedUser.id) ? <View style={styles.activeDot} /> : null}
                          <Typography size="sectionTitle">{item.linkedUser.name}</Typography>
                        </View>
                        <View style={{flexDirection: "row"}}>
                          {userInfo?.user?._id === item.lastMessage?.userId ? <Typography size="medium" weight="800">You: </Typography> : null}{item.lastMessage ? <Typography size={'medium'} weight={!item.lastMessage.status ? "600" : "400" }>{item.lastMessage.message}</Typography> : null}
                        </View>
                        {item.unReadMessagesCount ? <View style={styles.unReadMessagesIcon}><Typography color="whiteRegular" size={"small"}>{item.unReadMessagesCount}</Typography></View> : null}
                      </View>
                    </View>
                    
                  </TouchableOpacity>
                })
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 175,
  },
  fixedHeight: {
    height: 175,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textinputview: {
    width: "80%",
    paddingTop: Platform.OS === "ios" ? 13 : 5,
    justifyContent: "center",
  },
  topView: {
    width: "100%",
  },
  chatText: {
    color: "#000000",
    fontSize: RFValue(30, 580),
    marginTop: 10,
    fontFamily: "Poppins-Bold",
  },
  searchBarMainView: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 5,
    flexDirection: "row",
    padding: 5,
    alignItems: 'center',
    justifyContent: "center",
  },
  searchBarTextInput: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
    fontSize: RFValue(14, 580),
    width: "85%",
  },
  main: {
    width: "100%",
    backgroundColor: "#fff",
  },
  noRoomsView: {
    width: "100%",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  roomContainer: {
    width: "100%",
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: "grey",
    position: "relative",
    flex: 1,
    alignItems: "center",
  },
  textinputstyle: {
    color: "#fff",
    height: 50,
    fontFamily: "Poppins-Regular",
    fontSize: RFValue(12, 580),
  },
  roomContent: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
  },
  roomImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  roomTextContent: {
    paddingLeft: 10,
  },
  roomInnerText: {
    fontSize: RFValue(12, 580),
    fontFamily: "Poppins-Regular",
    color: "#000",
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    borderColor: Colors.black,
    borderWidth: 2,
    backgroundColor: Colors.success
  },
  unReadMessagesIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: '-95%',
    justifyContent: 'center',
    alignItems: 'center',
    top: 25,
    borderRadius: 10,
    backgroundColor: Colors.bgRedBtn
  },
});

export default Chat;


interface RoomDataInterface {
  _id: string;
  createdAt: string;
  linkedUser: {
    id: string;
    image: string;
    name: string;
  }
  lastMessage?: MessageInterface;
  unReadMessagesCount: number
}
