// @flow
import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import type { ImageRef } from "../data/image-ref";
import ContentPadding from "./ContentPadding";
import Text from "./Text";
import { lightNavyBlueColor, whiteColor } from "../constants/colors";

type Props = {
  image: ImageRef,
  title: string | string[],
  subtitle?: string
};

const ImageHeader = ({ image, title, subtitle }: Props) => (
  <ImageBackground style={styles.image} source={image} resizeMode="cover">
    <ContentPadding
      padding={{
        small: { horizontal: 8, vertical: 8 },
        medium: { horizontal: 16, vertical: 16 },
        large: { horizontal: 16, vertical: 16 }
      }}
      style={styles.contentPadding}
    >
      {(Array.isArray(title) ? title : [title]).map(line => (
        <Text key={line} type="h1" style={styles.title}>
          {line}
        </Text>
      ))}
      {subtitle && (
        <Text type="h2" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </ContentPadding>
  </ImageBackground>
);

ImageHeader.defaultProps = {
  subtitle: ""
};

const styles = StyleSheet.create({
  image: {
    aspectRatio: 2 / 1,
    justifyContent: "flex-end"
  },
  contentPadding: {
    alignItems: "flex-start"
  },
  title: {
    color: lightNavyBlueColor,
    backgroundColor: whiteColor,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  subtitle: {
    backgroundColor: lightNavyBlueColor,
    color: whiteColor,
    paddingHorizontal: 8,
    paddingTop: 4
  }
});

export default ImageHeader;
