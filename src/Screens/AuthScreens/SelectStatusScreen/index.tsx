import React, { useState } from "react";
import { View, ToastAndroid, ScrollView } from "react-native";
import Header from "../../../Components/Header";
import SelectStatusCard from "../../../Organisms/SelectStatusCard";
import { selectStatusesData } from "../../../constants/utilities";
import Button from "../../../Components/Button";
import styles from "./styles";
import { NavigationSwitchProp } from "react-navigation";
interface Props {
  navigation: NavigationSwitchProp;
} 

const SelectStatusScreen:React.FC<Props> = ({ navigation }) => {
  // Hooks

  const [selectedIndex, setSelectedIndex] = useState();
  const [disable, setDisable] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{title:string}>();

  // Functions
  const goNext = () => {
    if (!disable) {
      return ToastAndroid.show(
        "Please select your status. Trainer or Trainee?",
        ToastAndroid.SHORT
      );
    } else if (selectedItem?.title === "Trainer") {
      return navigation.navigate("SignUp", {
        role: "trainer",
      });
    } else if (selectedItem?.title === "Trainee") {
      return navigation.navigate("SignUp", {
        role: "trainee",
      });
    } else {
      return null;
    }
  };

  const selectItem = (i: React.SetStateAction<undefined>, item: React.SetStateAction<{ title: string; } | undefined>) => {
    setSelectedItem(item);
    setSelectedIndex(i);
    setDisable(true);
  };

  return (
    <View style={styles.mainContainer}>
      <Header label={"Select your Status"} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <SelectStatusCard
            data={selectStatusesData}
            onPressItem={selectItem}
            selectedIndex={selectedIndex}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          navigation={navigation}
          disabled={!disable}
          label={"Next"}
          onPress={goNext}
        />
      </View>
    </View>
  );
};

export default SelectStatusScreen;
