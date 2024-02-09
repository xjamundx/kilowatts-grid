import React, { useCallback, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet";

import { useGbLive } from "../../state/gb/hooks";
import { selectors, setSelectedUnitGroupCode } from "../../state/gb/live";

import { GbLiveBottomSheetTabs } from "./bottom-sheet-tabs/tabs";
import SvgMap from "./svg-map/svg-map";
import { WithTermsAndConditionsAccepted } from "./terms-and-conditions/acceptance";

const SNAP_POINTS = ["10%", "20%", "30%", "40%", "50%", "75%", "90%"];
const INITIAL_SNAP_POINT_INDEX = 2;

export const GbLiveWrapped = () => {
  const screen = useWindowDimensions();
  const dispatch = useDispatch();
  const isLoaded = useSelector(selectors.initialLoadComplete);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [currentSnapPointIndex, setCurrentSnapPointIndex] = React.useState(
    INITIAL_SNAP_POINT_INDEX
  );
  const usableHeight = React.useMemo(
    () => screen.height * (1 - currentSnapPointIndex / SNAP_POINTS.length),
    [currentSnapPointIndex, screen.height]
  );

  React.useEffect(() => {
    if (isLoaded) bottomSheetModalRef.current?.present();
  }, [isLoaded]);

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentSnapPointIndex(index);
    if (index <= INITIAL_SNAP_POINT_INDEX)
      dispatch(setSelectedUnitGroupCode(null));
  }, []);

  return (
    <View style={styles.mapContainer}>
      <BottomSheetModalProvider>
        <SvgMap />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={INITIAL_SNAP_POINT_INDEX}
          snapPoints={SNAP_POINTS}
          onChange={handleSheetChanges}
          enablePanDownToClose={false}
        >
          <GbLiveBottomSheetTabs usableHeight={usableHeight} />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export const GbLive = () => {
  useGbLive();
  return (
    <WithTermsAndConditionsAccepted>
      <GbLiveWrapped />
    </WithTermsAndConditionsAccepted>
  );
};

const styles = StyleSheet.create({
  contentContainer: {},
  mapContainer: {
    flex: 1
  },
  tabTitleStyle: {
    fontSize: 10
  }
});
