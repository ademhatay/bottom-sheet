import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet from './components/BottomSheet'

const App = () => {

	const [visible, setVisible] = useState(false)

	return <>
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Button title="Open" onPress={() => setVisible(!visible)} />
			<BottomSheet visible={visible} />
		</GestureHandlerRootView>
	</>
}

export default App

const styles = StyleSheet.create({})