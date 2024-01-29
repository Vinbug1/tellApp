
//baseUrl = 'https://wastbackend.onrender.com/api/v1/'


{
    Platform.OS == 'android' ? baseUrl = 'http://10.0.2.2:6000/api/v1/': baseUrl = 'http://localhost:6000/api/v1/'
}
export default baseUrl