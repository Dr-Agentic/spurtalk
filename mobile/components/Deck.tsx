import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { api } from "../lib/api";
import { Task } from "@spurtalk/shared";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export function Deck() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    fetchDeck();
  }, []);

  const fetchDeck = async () => {
    try {
      const { data } = await api.get<Task[]>("/tasks/deck");
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: "right" | "left" | "down") => {
    const task = tasks[currentIndex];
    if (!task) return;

    try {
      await api.post(`/tasks/deck/${task.id}/swipe`, { direction });
      setCurrentIndex((prev) => prev + 1);
      translateX.value = 0;
      translateY.value = 0;
    } catch (error) {
      console.error(error);
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(handleSwipe)("right");
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(handleSwipe)("left");
      } else if (event.translationY > SWIPE_THRESHOLD) {
        // Swipe down
        runOnJS(handleSwipe)("down");
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(translateX.value, [-SCREEN_WIDTH, SCREEN_WIDTH], [-30, 30], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  if (loading) return <ActivityIndicator size="large" />;

  const activeTask = tasks[currentIndex];
  if (!activeTask)
    return (
      <View style={styles.center}>
        <Text>All caught up!</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>{activeTask.title}</Text>
          <Text style={styles.effort}>{activeTask.effortLevel}</Text>
          {activeTask.description ? (
            <Text style={styles.desc}>{activeTask.description}</Text>
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: 500,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  effort: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  desc: {
    textAlign: "center",
    color: "#444",
  },
});
