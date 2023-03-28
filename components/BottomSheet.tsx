import {
	StyleSheet,
	Text,
	View,
	Dimensions,
} from 'react-native'
import React, { useRef } from 'react';
import { PanGestureHandler,GestureHandlerGestureEvent  } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring } from 'react-native-reanimated';




const { height } = Dimensions.get('window');

type BottomSheetProps = {

}

const BottomSheet: React.FC<BottomSheetProps> = ({ }) => {


	const translateY = useSharedValue(0);

	const onGestureEvent = useAnimatedGestureHandler<GestureHandlerGestureEvent, { startY: number, }>({
		onStart: (_, ctx) => {
			ctx.startY = translateY.value;
		},
		onActive: (event:any, ctx) => {
			translateY.value = ctx.startY + event.translationY;
			console.log(translateY.value);
			if (translateY.value < -600) {
				translateY.value = -600;
				return
			}
			
		},
		onEnd: () => {
			const snapPoint = -600;
			const snapPoint2 = -100;
			if (translateY.value < snapPoint) {
				translateY.value = withSpring(snapPoint);
			} else if (translateY.value > snapPoint2) {
				translateY.value = withSpring(snapPoint2);
			}
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
		  transform: [{ translateY: translateY.value }],
		};
	  });

	return <>
		<PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View style={[styles.container, animatedStyle]}>
				<View style={styles.line} />
				<Text>BottomSheet</Text>
			</Animated.View>
		</PanGestureHandler>
	</>
}

export default BottomSheet

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		backgroundColor: '#eee',
		height: height,
		width: '100%',
		top: height - 100,
		left: 0,
		right: 0,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
	},
	line: {
		height: 5,
		width: 70,
		backgroundColor: '#ccc',
		borderRadius: 10,
		alignSelf: 'center',
		marginVertical: 10,
		marginTop: 0,
	}
})