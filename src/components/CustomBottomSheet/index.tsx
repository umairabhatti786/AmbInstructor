import { SafeAreaView, View } from "react-native";
import React, { useMemo, useCallback } from "react";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { theme } from "../../utils/Themes";

const CustomBottomSheet = (props: any) => {
  const {
    bottomSheetModalRef,
    snapTo,
    onDismiss,
    children,
    snap,
    handleSheetChanges,
  } = props;

  const snapPoints = useMemo(() => ["55%", "95%"], []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        bottomSheetModalRef.current?.close();
      };
    }, [])
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={(props) => (
        <Backdrop {...props} bottomSheetModalRef={bottomSheetModalRef} />
      )}
      snapPoints={snapPoints}
      index={0}
      backgroundStyle={{backgroundColor:theme.colors.background}}
      onDismiss={props?.onDismiss}
    >
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <View style={{ paddingBottom: 30 }}>{children}</View>
        </SafeAreaView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const Backdrop = ({ animatedIndex, bottomSheetModalRef, style }: any) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [1, 1],
      [1, 1],
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(0,0,0,0.6)",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View
      onTouchStart={() => bottomSheetModalRef.current?.close()}
      style={containerStyle}
    />
  );
};
export default CustomBottomSheet;
