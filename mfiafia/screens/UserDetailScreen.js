import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Image, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * A user page screen for a specific user.
 */
export default class UserDetailScreen extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            styleIndex: 0,
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('#455a64');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.cover, { backgroundColor: "#455a64"}]} />
                <Image style={styles.avatar} source={{uri: this.props.navigation.getParam('userAvatarUrl', 'https://i.stack.imgur.com/l60Hf.png')}}/>
                <TouchableOpacity style={this.state.styleIndex === 0 ? styles.addFriendButton : styles.addFriendButtonClicked} onPress={this._addOrDeleteFriend.bind(this)}>
                    <Icon name="md-person-add" color="#ffffff" size={30} />
                </TouchableOpacity>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.firstName}>{this.props.navigation.getParam('userFirstName', 'No Name')} </Text>
                            <Text style={styles.lastName}>{this.props.navigation.getParam('userLastName', '')}</Text>
                        </View>
                        <Text style={styles.status}>"Status Message"</Text>
                        <View style={styles.stats}>
                            <View style={styles.fiasStats}>
                                <Text style={styles.numFias}>0</Text>
                                <Text style={styles.fias}>Fias</Text>
                            </View>
                            <View style={styles.ongoingStats}>
                                <Text style={styles.numOngoing}>0</Text>
                                <Text style={styles.ongoing}>Ongoing</Text>
                            </View>
                            <View style={styles.doneStats}>
                                <Text style={styles.numDone}>0</Text>
                                <Text style={styles.done}>Done</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * A function call that allows toggling of the add/delete friend button.
     */
     _addOrDeleteFriend = async () => {
         if (this.state.styleIndex === 0) {
             fetch('http://10.0.2.2:8000/user/friend_user', {
                 method: 'POST',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'Authorization': 'token a63d666372358f91b1af7d4b94bba9d28df3b24e'
                 },
                 body: JSON.stringify({
                     username: 'mschoi2'
                 })
             })
             .then((response) => {
                 if (response.status === 200) {
                     this.setState({ styleIndex: 1 });
                     alert(JSON.stringify(response._bodyText));
                 } else if (response.status === 404){
                     alert("Email doesn't exist");
                 } else if (response.status === 401) {
                     alert("Email and password do not match");
                 } else {
                     alert("Network Error");
                 }
             })
             .catch((error) => {
                 console.error(error);
             });
         } else {
             fetch('http://10.0.2.2:8000/user/friend_user', {
                 method: 'DELETE',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'Authorization': 'token a63d666372358f91b1af7d4b94bba9d28df3b24e'
                 },
                 body: JSON.stringify({
                     username: 'mschoi2'
                 })
             })
             .then((response) => {
                 if (response.status === 200) {
                     this.setState({ styleIndex: 0 });
                     alert(JSON.stringify(response._bodyText));
                 } else if (response.status === 404){
                     alert("Email doesn't exist");
                 } else if (response.status === 401) {
                     alert("Email and password do not match");
                 } else {
                     alert("Network Error");
                 }
             })
             .catch((error) => {
                 console.error(error);
             });
         }
     }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cover: {
        height: 200,
        alignSelf: 'stretch',
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: 'white',
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 100,
        marginBottom: 10,
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    firstName: {
        fontSize: 28,
        color: "#000000"
    },
    lastName: {
        fontSize: 28,
        color: "#000000"
    },
    status: {
        fontSize: 16,
        color: "#455a64",
    },
    stats: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 40,
        marginBottom: 40,
        alignSelf: 'center',
    },
    fiasStats: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    numFias: {
        fontSize: 16,
        color: "#696969",
    },
    fias: {
        marginTop: 6,
        fontSize: 16,
        color: "#696969",
        fontWeight: 'bold',
    },
    ongoingStats: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    numOngoing: {
        fontSize: 16,
        color: "#696969",
    },
    ongoing: {
        marginTop: 6,
        fontSize: 16,
        color: "#696969",
        fontWeight: 'bold',
    },
    doneStats: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    numDone: {
        fontSize: 16,
        color: "#696969",
    },
    done: {
        marginTop: 6,
        fontSize: 16,
        color: "#696969",
        fontWeight: 'bold',
    },
    addFriendButton: {
        alignSelf: 'flex-end',
        margin: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'green',
        borderRadius: 50,
    },
    addFriendButtonClicked: {
        alignSelf: 'flex-end',
        margin: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'red',
        borderRadius: 50,
    }
});
