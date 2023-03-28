import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image
} from 'react-native'
import React from 'react';
import { PanGestureHandler, GestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import movies from '../config/data';


const { height } = Dimensions.get('window');

const SNAP_POINT = 600;
const MAX_SNAP_POINT = 650;
const MIN_VELOCITY = 500;

type BottomSheetProps = {
	visible: boolean;
}


const BottomSheet: React.FC<BottomSheetProps> = ({ visible }) => {


	const translateY = useSharedValue(-SNAP_POINT / 2);

	const onGestureEvent = useAnimatedGestureHandler<GestureHandlerGestureEvent, { startY: number, }>({
		onStart: (_, ctx) => {
			ctx.startY = translateY.value;
		},
		onActive: (event: any, ctx) => {
			translateY.value = ctx.startY + event.translationY;
			if (translateY.value < -MAX_SNAP_POINT) {
				translateY.value = -MAX_SNAP_POINT;
				return
			}

		},
		onEnd: (event: any) => {
			const snapPoint = -SNAP_POINT;
			const snapPoint2 = SNAP_POINT;
			if (event.velocityY < MIN_VELOCITY) {
				translateY.value = withSpring(snapPoint);
			} else if (event.velocityY > -MIN_VELOCITY) {
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
		{visible && <PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View style={[styles.container, animatedStyle]}>
				<View style={styles.line} />
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Image resizeMode='contain' source={{ uri: movies[0].poster }} style={{ width: 300, height: 400 }} />
					<Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>{movies[0].title}</Text>
					<Text style={{ fontSize: 16, marginTop: 10 }}>{movies[0].year}</Text>
					<Text style={{ fontSize: 16, marginTop: 10 }}>{movies[0].genre}</Text>
					<Text style={{ fontSize: 16, marginTop: 10 }}>{movies[0].summary}</Text>
				</View>
			</Animated.View>
		</PanGestureHandler>}
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