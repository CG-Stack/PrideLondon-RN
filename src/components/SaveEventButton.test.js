// @flow
import React from "react";
import { Animated, Easing } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { shallow } from "enzyme";
import SaveEventButton from "./SaveEventButton";

jest.mock("react-native-haptic-feedback", () => ({
  trigger: jest.fn()
}));

beforeEach(() => {
  ReactNativeHapticFeedback.trigger.mockClear();
});

it("renders correctly", () => {
  const output = shallow(<SaveEventButton active={false} onPress={() => {}} />);
  expect(output).toMatchSnapshot();
});

it("renders correctly when active", () => {
  const output = shallow(<SaveEventButton active onPress={() => {}} />);
  expect(output).toMatchSnapshot();
});

describe("getDerivedStateFromProps", () => {
  it("updates state while not animating and active", () => {
    const props = {
      active: true,
      onDark: false,
      onPress: () => {}
    };
    const state = {
      animating: false,
      progress: new Animated.Value(0)
    };
    expect(SaveEventButton.getDerivedStateFromProps(props, state)).toEqual({
      animating: false,
      progress: new Animated.Value(1)
    });
  });

  it("updates state while not animating and inactive", () => {
    const props = {
      active: false,
      onDark: false,
      onPress: () => {}
    };
    const state = {
      animating: false,
      progress: new Animated.Value(1)
    };
    expect(SaveEventButton.getDerivedStateFromProps(props, state)).toEqual({
      animating: false,
      progress: new Animated.Value(0)
    });
  });

  it("does not update state while animating", () => {
    const props = {
      active: true,
      onDark: false,
      onPress: () => {}
    };
    const state = {
      animating: true,
      progress: new Animated.Value(1)
    };
    expect(SaveEventButton.getDerivedStateFromProps(props, state)).toEqual(
      state
    );
  });
});

describe("onPress", () => {
  describe("when active", () => {
    it("animates to start of animation", () => {
      const mockAnimatedValue = {};
      jest.mock("Animated", () => ({
        timing: jest.fn(() => ({
          start: jest.fn()
        })),
        Value: jest.fn(() => mockAnimatedValue)
      }));

      const onPress = jest.fn();
      const output = shallow(<SaveEventButton active onPress={onPress} />);

      output.simulate("press");
      expect(Animated.timing).toBeCalledWith(mockAnimatedValue, {
        duration: 0,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true
      });
      expect(onPress).toBeCalledWith(false);
    });
  });

  describe("when inactive", () => {
    it("animates the heart and vibrates", () => {
      const mockAnimatedValue = {};
      jest.mock("Animated", () => ({
        timing: jest.fn(() => ({
          start: jest.fn()
        })),
        Value: jest.fn(() => mockAnimatedValue)
      }));

      const onPress = jest.fn();
      const output = shallow(
        <SaveEventButton active={false} onPress={onPress} />
      );

      output.simulate("press");
      expect(Animated.timing).toBeCalledWith(mockAnimatedValue, {
        duration: 800,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true
      });
      expect(ReactNativeHapticFeedback.trigger).toBeCalledWith("impactHeavy");
      expect(onPress).toBeCalledWith(true);
    });
  });
});
