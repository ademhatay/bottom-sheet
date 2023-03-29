# bottom-sheet
Bottom Sheet with Gestures &amp; reanimated

---

React Native ile 'BottomSheet' Oluşturmak
Bu yazıda react-native-gesture-handler ve react-native-reanimated kullanarak sıfırdan basit bir "bottomSheet" componenti oluşturacağız.
Demo: https://youtu.be/Q993Lm0-Qp4

Zaman kaybetmeden başlayalım.

- `npx react-native init bottomSheet` diyerek projemizi kuralım.
- `npm start` ile projeyi çalıştıralım ve emülatörümüzde çalıştıralım.
- Ve gerekli paketleri kuralım: `react-native-gesture-handler` ve `react-native-reanimated`
- - https://docs.swmansion.com/react-native-gesture-handler/
- - https://docs.swmansion.com/react-native-reanimated/

---

- app.tsx dosyasını düzenleyip aşağıdaki gibi yapımızı kuralım

```
 // App.tsx
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
```

ana dizinimiz içerisinde components klasörü oluşturup içerisine `BottomSheet.tsx` dosyamızı oluşturalım ve başlangıç snipetleri yardımı ile hızlıca componentimizin temelini atalım.
```
// components/BottomSheet
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// propsType
type BottomSheetProps = {
 visible: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ visible }) => {

 return <>
  // 
 </>
}

export default BottomSheet

const styles = StyleSheet.create({})
```


Şimdi sırada bottomSheet'imizin tasarımını oluşturmakta
Daha sonra Gesture Event'imizi oluşturup componentimizin ilk halini göreceğiz.

Tasarımı oluşturmadan önce ana dizin içerisinde bir config klasörü oluşturup içersine data.js dosyası oluşturdum. BottomSheet' içeriğini buradan alıyorum.
```
// config/data.js
const movies = [
 {

  id: 1,
  title: 'The Shawshank Redemption',
  year: 1994,
  genre: 'Drama',
  rating: 9.2,
  poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg',
  summary: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
 },
];

export default movies;
```
`BottomSheet.tsx`' e dönüp;

```
// components/BottomSheet

import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { PanGestureHandler, GestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

// propsType
type BottomSheetProps = {
 visible: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ visible }) => {

 return <>
 {visible && <PanGestureHandler onGestureEvent={onGestureEvent}>
   <Animated.View style={styles.container}>
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

```
- Gesture Event'imizi oluşturabiliriz.
- Sabitlerimizi Tanımlayalım
```
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { PanGestureHandler, GestureHandlerGestureEvent } from 'react-native-gesture-handler';

const SNAP_POINT = 600;
const MAX_SNAP_POINT = 650;
const MIN_VELOCITY = 500;
....
useSharedValue ile başlangıç değerimizi oluşturalım ve gerekli importları yapalım
import Animated, {
useSharedValue,
useAnimatedGestureHandler,
useAnimatedStyle,
withSpring
} from 'react-native-reanimated';

const BottomSheet: React.FC<BottomSheetProps> = ({ visible }) => {

 const translateY = useSharedValue(-SNAP_POINT / 2);

....
}
```
- Gesture Event'imizi oluşturalım

```
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
 ```
 
- yukarıda useAnimatedGestureHandler ile kullanıcının dokunuşunun başladığı an, devam ettiği an ve bittiği anda gerekli olayları tanımladık.
- ctx, geçici değer tutucu görevi yapıyor.
- burada event'i konsolunuza yazdırırsanız gelen değerleri (event.velocity, event.translationY gibi) görebilirsiniz
- son bir adım kaldı, animatedStyle'ımızı oluşturup PanGestureHandler altındaki View'imizi hareketlendirmek
```
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
 ```
- Şu aşamaya kadar basit bir component oluşturduk, gerekli animasyonları tanımladık. İstekler doğrultusunda daha da geliştirilip özelleştirilebilir.

Medium'da yazı: https://medium.com/@ademhatay/react-native-ile-bottomsheet-oluşturmak-a3d89841669b
- Geliştirmeler ve düzeltmeler için pull request gönderebilirsiniz.
