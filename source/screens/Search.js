import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Input from "../utils/Input";
import SearchCard from './SearchCard';
import baseUrl from "../../assets/baseUrl";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

// const { width } = Dimensions.get("window");
// const defaultImageSource = require("../../assets/images/briefcase.png");

const Search = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [user, setUser] = useState();
    const [userName, setUserName] = useState();
    const [tkn, setTkn] = useState("");
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const [caseData, setCaseData] = useState([]);


    useEffect(() => {
        AsyncStorage.getItem("userString")
            .then((data) => {
                if (data) {
                    //console.log("working things out", data);
                    const userDetails = JSON.parse(data);
                    setUserName(userDetails.fullname);
                    setUser(userDetails.userId);
                    setTkn(userDetails.token);
                } else {
                    console.log("Object not found in AsyncStorage");
                }
            })
            .catch((error) => {
                console.error("Error retrieving object:", error);
            });

        getData();
    }, [user]);

    const getData = () => {
        setLoading(true);
        let config = {
            method: "get",
            url: `${baseUrl}cases/userId/${user}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tkn}`,
            },
        };
        axios.request(config).then((response) => {
            //console.log(response.data);
            setCaseData(response.data);
            setSearchResult(response.data); // Initially set searchResult to the fetched data
            //setLoading(false);
            setNoData(response.data.length === 0);
        })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                setNoData(true);
            });
    };

    useEffect(() => {
        // Automatically trigger search when the user types at least three letters
        if (searchQuery.length >= 3) {
            handleSearch();
        } else {
            setSearchResult(caseData); // Reset search results to the initial data
        }
    }, [searchQuery]);

    const handleSearch = () => {
        const result = caseData.filter(
            item => item.caseCategory && item.caseCategory.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
            // Add more fields for searching as needed
        );
        setSearchResult(result);
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={navigation.goBack} style={styles.icon}>
                <AntDesign name="leftcircleo" size={33} color="#000A83" />
            </TouchableOpacity>
            <View style={{ marginTop: 45 }}>
                <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center" }}>Find Case</Text>
                <View style={{ marginTop: 10 }}>
                    <Input
                        placeholder="Search Case"
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : noData ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={styles.noResult}>Oooops!</Text>
                    <Text style={styles.noResultText}>We can’t seem to find a case file with the above case number.
                        You might have typed in the wrong case number. In the  mean
                        time, try again or return to your dashboard.</Text>
                </View>
            ) : (

                <>
                    <SearchCard
                        originalCaseData={caseData} // Pass the original data
                        searchResult={searchResult} // Pass the filtered results
                        userName={userName}

                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
    },
    noResult: {
        fontSize: 22,
        color: '#000A83',
        fontWeight: 'bold',
    },
    noResultText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    icon: {
        backgroundColor: "whitesmoke",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        height: 40,
        width: 40,
        //position: "absolute",
        top: 35,
        left: 12,
    },
});

export default Search;






























// import React, { useState, useEffect, useCallback } from "react";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Octicons, Entypo } from "@expo/vector-icons";
// import { View, TextInput, FlatList, Text, StyleSheet,Dimensions,ActivityIndicator } from 'react-native';
// import Input from "../utils/Input";
// import SearchCard from './SearchCard';
// import baseUrl from "../../assets/baseUrl";
// import axios from "axios";

// const { width } = Dimensions.get("window");

// const defaultImageSource = require("../../assets/images/briefcase.png");


// const Search = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResult, setSearchResult] = useState([]);
//     const [user, setUser] = useState();
//     const [tkn, setTkn] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [noData, setNoData] = useState(false);
//     const [caseData, setCaseData] = useState([])

//     useEffect(() => {
//         AsyncStorage.getItem("userString")
//             .then((data) => {
//                 if (data) {
//                     const userDetails = JSON.parse(data);
//                     setUser(userDetails.userId);
//                     setTkn(userDetails.token);
//                 } else {
//                     console.log("Object not found in AsyncStorage");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error retrieving object:", error);
//             });

//         getData();
//     }, [user]);

//     const getData = () => {
//         setLoading(true);
//         let config = {
//             method: "get",
//             url: `${baseUrl}cases/userId/${user}`,
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${tkn}`,
//             },
//         };
//         axios
//             .request(config)
//             .then((response) => {
//                 setCaseData(response.data);
//                 setSearchResult(response.data); // Initially set searchResult to the fetched data
//                 setLoading(false);
//                 setNoData(response.data.length === 0);
//             })
//             .catch((error) => {
//                 console.log(error);
//                 setLoading(false);
//                 setNoData(true);
//             });
//     };

//     useEffect(() => {
//         // Automatically trigger search when the user types at least three letters
//         if (searchQuery.length >= 3) {
//             handleSearch();
//         } else {
//             setSearchResult(caseData); // Reset search results to the initial data
//         }
//     }, [searchQuery]);

//     const handleSearch = () => {
//         const result = caseData.filter(
//             item =>
//                 item.defendantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 item.defendantPhone.toLowerCase().includes(searchQuery.toLowerCase())
//             // Add more fields for searching as needed
//         );
//         setSearchResult(result);
//     };

//     // const [searchQuery, setSearchQuery] = useState('');
//     // const [searchResult, setSearchResult] = useState([]);

//     // const navigation = useNavigation();
//     // const [user, setUser] = useState();
//     // const [userName,setUserName] = useState();
//     // const [caseData, setCaseData] = useState([]);
//     // const [selectedDecision, setSelectedDecision] = useState(null);
//     // const [tkn, setTkn] = useState("");
//     // const [loading, setLoading] = useState(true);
//     // const [noData, setNoData] = useState(false);
  
//     // useFocusEffect(
//     //   useCallback(() => {
//     //     AsyncStorage.getItem("userString")
//     //       .then((data) => {
//     //         if (data) {
//     //          // console.log(data);
//     //           const userDetails = JSON.parse(data);
//     //           setUserName(userDetails.fullname);
//     //           setUser(userDetails.userId);
//     //           setTkn(userDetails.token);
//     //         } else {
//     //           console.log("Object not found in AsyncStorage");
//     //         }
//     //       })
//     //       .catch((error) => {
//     //         console.error("Error retrieving object:", error);
//     //       });
  
//     //     getData();
//     //   }, [user])
//     // );
  
//     // const getData = () => {
//     //   setLoading(true);
//     //   let config = {
//     //     method: "get",
//     //     url: `${baseUrl}cases/userId/${user}`,
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${tkn}`,
//     //     },
//     //   };
//     //   axios
//     //     .request(config)
//     //     .then((response) => {
//     //       console.log("Working things out ", response.data);
//     //       setCaseData(response.data);
//     //       setLoading(false);
//     //       setNoData(response.data.length === 0);
//     //     })
//     //     .catch((error) => {
//     //       console.log(error);
//     //       setLoading(false);
//     //       setNoData(true);
//     //     });
//     // };

//     // useEffect(() => {
//     //     // Automatically trigger search when the user types at least three letters
//     //     if (searchQuery.length >= 3) {
//     //         handleSearch();
//     //     } else {
//     //         setSearchResult([]); // Clear the result when the query is less than three letters
//     //     }
//     // }, [searchQuery]);

//     // const handleSearch = () => {
//     //     const result = data.filter(
//     //         item =>
//     //             item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     //             item.number.toLowerCase().includes(searchQuery.toLowerCase())
//     //     );
//     //     setSearchResult(result);
//     // };

//     const renderSearchItem = ({ item }) => (
//         <SearchCard
//             caseData={item} // Assuming caseDetails contains user information
//             //onAccept={() => handleAccept(item)}
//             //onDecline={() => handleDecline(item)}
//         />
//     );
//     const handleAccept = (caseDetails) => {
//         // Handle the accept action
//         console.log('Accepted:', caseDetails);
//     };

//     const handleDecline = (caseDetails) => {
//         // Handle the decline action
//         console.log('Declined:', caseDetails);
//     };

    


//     return (
//         <View style={styles.container}>
//   <View style={styles.container}>
//             <View style={{ marginTop: 65 }}>
//                 <Text style={{ fontSize: 20, fontWeight: "900", textAlign: "center" }}>Find Case</Text>
//                 <View style={{ marginTop: 20 }}>
//                     <Input
//                         placeholder="Search Case"
//                         value={searchQuery}
//                         onChangeText={(text) => setSearchQuery(text)}
//                     />
//                 </View>
//             </View>
//             {loading ? (
//                 // ActivityIndicator while loading
//                 <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
//             ) : noData ? (
//                 // No data message
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
//                     <Text style={styles.noResult}>Oooops!</Text>
//                     <Text style={styles.noResultText}>We can’t seem to find a case file with the above case number.
//                         You might have typed in the wrong case number. In the  mean
//                         time, try again or return to your dashboard.</Text>
//                 </View>
//             ) : (
//                 // Display the data
//                 <FlatList
//                     data={searchResult}
//                     keyExtractor={(item) => item._id.toString()}
//                     renderItem={renderSearchItem}
//                 />
//             )}
//         </View>

//         </View>

//         // <View style={styles.container}>
//         //     <View style={{ marginTop: 65 }}>
//         //         <Text style={{ fontSize: 20, fontWeight: "900", textAlign: "center" }}>Find Case</Text>
//         //         <View style={{ marginTop: 20 }}>
//         //             <Input
//         //                 placeholder="Search Case"
//         //                 value={searchQuery}
//         //                 onChangeText={(text) => setSearchQuery(text)}
//         //             />
//         //         </View>
//         //     </View>
//         //     {searchResult.length > 0 ? (
//         //         <FlatList
//         //             data={searchResult}
//         //             keyExtractor={(item) => item.id.toString()}
//         //             renderItem={renderSearchItem}
//         //         />
//         //     ) : (
//         //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>

//         //             <Text style={styles.noResult}>Oooops!</Text>
//         //             <Text style={styles.noResultText}>We can’t seem to find a case file with the above case number.
//         //                 You might have typed in the wrong case number. In the  mean
//         //                 time, try again or return to your dashboard.</Text>
//         //         </View>
//         //     )}
//         // </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#FFFFFF",
//         padding: 16,
//     },
//     input: {
//         height: 40,
//         borderColor: '#000',
//         borderWidth: 1,
//         marginBottom: 16,
//         paddingLeft: 8,
//         borderRadius: 8,
//     },
//     resultItem: {
//         fontSize: 16,
//         marginBottom: 8,
//     },
//     noResult: {
//         fontSize: 22,
//         color: '#000A83',
//         fontWeight: 'bold',
//     },
//     noResultText: {
//         fontSize: 16,
//         color: 'gray',
//         textAlign: 'center',
//     },
// });

// export default Search;
