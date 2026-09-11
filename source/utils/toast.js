import Toast from "react-native-root-toast";

export const showToast = (message, long = false) => {
  Toast.show(String(message), {
    duration: long ? Toast.durations.LONG : Toast.durations.SHORT,
  });
};
