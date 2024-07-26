import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(imageSize);

  const doubleTap = Gesture.Tap() // 创建一个 Tap 手势对象
    .numberOfTaps(2) // 设置该手势为双击
    .onStart(() => {
      // 定义手势开始时执行的回调函数
      if (scaleImage.value !== imageSize * 2) {
        // 如果当前的 scaleImage 的值不等于 imageSize 的两倍
        scaleImage.value = scaleImage.value * 2; // 将 scaleImage 的值乘以 2
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.View>
            <Animated.Image
              source={stickerSource}
              resizeMode="contain"
              style={[imageStyle]}
            />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
