// @flow
import React, { PureComponent, Fragment } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type { NavigationScreenProp } from "react-navigation";
import Button from "../../components/Button";
import ContentPadding from "../../components/ContentPadding";
import SectionHeader from "../../components/SectionHeader";
import CheckBox from "../../components/CheckBox";
import { bgColor, filterModalShadow } from "../../constants/colors";
import tags from "../../data/tags";
import text from "../../constants/text";
import type { FilterCollection, Area } from "../../data/event-filters";
import Header from "./Header";

export type TagFilter = { [string]: Set<string> };

type Props = {
  navigation: NavigationScreenProp<{}>,
  applyButtonText: string,
  eventFilters: FilterCollection,
  onChange: TagFilter => void,
  onApply: () => void,
  onCancel: () => void
};

class FilterModal extends PureComponent<Props> {
  static navigationOptions = ({
    navigation
  }: {
    navigation: NavigationScreenProp
  }) => ({
    header: (
      <Header
        onClearPress={() =>
          navigation.state.params && navigation.state.params.handleClear()
        }
        onCancelPress={() => navigation.goBack()}
      />
    )
  });

  componentDidMount() {
    const { navigation, onCancel } = this.props;
    this.didBlurSubscription = navigation.addListener("willBlur", onCancel);

    navigation.setParams({
      handleClear: this.clearTagFilters
    });
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove();
  }

  didBlurSubscription: {
    remove: () => void
  };

  toggleTagFilter = (
    selectedValues: Set<string> | Set<Area>,
    sectionValue: string
  ) => {
    const values: Set<string> = new Set([...selectedValues]);
    if (!values.delete(sectionValue)) {
      values.add(sectionValue);
    }
    return values;
  };

  clearTagFilters = () =>
    this.props.onChange(
      Object.keys(tags).reduce((acc, key) => ({ ...acc, [key]: new Set() }), {})
    );

  render() {
    const {
      applyButtonText,
      onApply,
      onChange,
      eventFilters,
      navigation
    } = this.props;
    return (
      <SafeAreaView style={styles.flex} forceInset={{ bottom: "always" }}>
        <ScrollView style={styles.flex}>
          {Object.keys(tags).map(
            sectionName =>
              eventFilters[sectionName] && (
                <Fragment key={sectionName}>
                  <SectionHeader
                    title={text.tags[sectionName]}
                    hasShadow={false}
                  />
                  <ContentPadding>
                    {tags[sectionName].map(sectionValue => (
                      <CheckBox
                        key={sectionValue}
                        onChange={() => {
                          onChange({
                            [sectionName]: this.toggleTagFilter(
                              eventFilters[sectionName],
                              sectionValue
                            )
                          });
                        }}
                        checked={eventFilters[sectionName].has(sectionValue)}
                        // $FlowFixMe
                        label={text.tags[sectionValue] || sectionValue}
                      />
                    ))}
                  </ContentPadding>
                </Fragment>
              )
          )}
        </ScrollView>
        <View style={styles.footer}>
          <ContentPadding>
            <Button
              text={applyButtonText}
              onPress={() => {
                onApply();
                navigation.goBack();
              }}
            />
          </ContentPadding>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: bgColor
  },
  footer: {
    height: 60,
    paddingVertical: 8,
    backgroundColor: bgColor,

    // ios shadow
    shadowColor: filterModalShadow,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    // android shadow
    borderWidth: 0,
    elevation: 3,
    marginTop: 6
  }
});

export default FilterModal;
