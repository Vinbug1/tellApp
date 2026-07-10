// const DEV_IP = "192.168.1.4";

// const baseUrl = `http://${DEV_IP}:3000/api/v1/`;

// export default baseUrl;
















import { Platform } from "react-native";

const DEV_IP = "192.168.1.4";

const baseUrl = __DEV__
  ? Platform.select({
      android: "http://192.168.1.4:3000/api/v1/", ios: `http://${DEV_IP}:3000/api/v1/`, default: `http://${DEV_IP}:3000/api/v1/`,
    })
  : "https://tellbackend.onrender.com/api/v1/";

export default baseUrl;



// import { Platform } from 'react-native';

// // DEV — uncomment when testing locally
//  const DEV_IP = '10.88.163.196';
// const baseUrl = __DEV__
//   ? Platform.OS === 'android'
//     ? 'http://10.0.2.2:3000/api/'
//     : `http://${DEV_IP}:3000/api/`
//   : 'https://tellbackend.onrender.com/api/v1/';

// // PRODUCTION
// // const baseUrl = 'https://tellbackend.onrender.com/api/v1/';

// export default baseUrl;