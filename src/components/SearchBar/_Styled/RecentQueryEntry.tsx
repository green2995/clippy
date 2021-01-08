import { getComponentConstant } from "@api/constants";
import { defineThemedComponent } from "@utils/theme";
import chroma from "chroma-js";
import { css } from "styled-components";
import { View, Text, TouchableOpacity } from "react-native";
import { getIconSet } from "@api/icons";
import Animated from "react-native-reanimated";

const {SEARCH_INPUT_WIDTH} = getComponentConstant("searchBar");

const Container = defineThemedComponent<{}, React.ComponentProps<typeof Animated.View>>({
  baseComponent: Animated.View,
  themeMapper: (colors) => css`
    background-color: ${chroma.mix(colors.background, colors.primary, 0.05).hex()};
    border-color: ${chroma(colors.primary).alpha(0.2).darken().hex()};
  `,
  commonStyle: css`
    width: ${SEARCH_INPUT_WIDTH}px;
    height: 40px;
    align-items: center;
    border-width: 0.5px;
    padding: 5px;
    justify-content: space-between;
    flex-direction: row;
  `,
});

const QueryText = defineThemedComponent({
  baseComponent: Animated.Text,
  themeMapper: (colors) => css`
    color: ${chroma(colors.background).luminance() > 0.5
      ? chroma("black").brighten().hex()
      : chroma("grey").darken().hex()};
  `,
  commonStyle: css`
    position: absolute;
    left: 5px;
    color: black;
  `,
})

const IconContainer = defineThemedComponent({
  baseComponent: TouchableOpacity,
  themeMapper: (colors) => css`
    background-color: ${chroma(colors.background).hex()};
    border-color: ${chroma(colors.primary).hex()};
  `,
  commonStyle: css`
    border-width: 0.5px;
    border-radius: 5px;
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 5px;
  `,
})

const Icon = defineThemedComponent({
  baseComponent: getIconSet("FontAwesome"),
  themeMapper: (colors) => css`
    color: ${colors.error};
  `,
})

export default {
  Container,
  QueryText,
  IconContainer,
  Icon,
}