// @flow
import React from "react";
import { PixelRatio, StyleSheet, View } from "react-native";
import Text from "../../components/Text";
import Touchable from "../../components/Touchable";
import {
  inputFieldBorderColor,
  eucalyptusGreenColor
} from "../../constants/colors";

type Props = {|
  onSelectedIndexChange: number => void,
  selectedIndex: ?number,
  values: string[]
|};

const SegmentedControl = ({
  onSelectedIndexChange,
  selectedIndex,
  values
}: Props) => (
  <View style={styles.container}>
    {values.map((value, index) => (
      <Touchable
        key={value}
        accessibilityComponentType={
          index === selectedIndex
            ? "radiobutton_checked"
            : "radiobutton_unchecked"
        }
        accessibilityTraits={
          index === selectedIndex ? ["button", "selected"] : ["button"]
        }
        onPress={() => onSelectedIndexChange(index)}
        style={[
          styles.button,
          index === selectedIndex && styles.buttonSelected,
          index === 0 && styles.buttonBorderStart,
          index === values.length - 1 && styles.buttonBorderEnd,
          index - 1 !== selectedIndex && styles.borderButtonLeft
        ]}
        testID={`button-${index}`}
      >
        <Text type="h2" color="lightNavyBlueColor" style={styles.buttonText}>
          {value}
        </Text>
      </Touchable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  button: {
    flexGrow: 1,
    borderColor: inputFieldBorderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50 * PixelRatio.getFontScale(),
    alignItems: "center",
    justifyContent: "center"
  },
  buttonSelected: {
    borderColor: eucalyptusGreenColor,
    backgroundColor: eucalyptusGreenColor
  },
  buttonBorderStart: {
    borderLeftWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  buttonBorderEnd: {
    borderRightWidth: 1,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  borderButtonLeft: {
    borderLeftWidth: 1
  },
  buttonText: {
    marginTop: 2
  }
});

export default SegmentedControl;
