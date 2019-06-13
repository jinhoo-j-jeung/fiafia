import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Image, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import EditProfileScreen from './EditProfileScreen';

/**
 * A profile screen that renders the logged-in user's profile.
 */
export default class ProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            statusMessage: '',
            numFias: 0,
            numOngoing: 0,
            numDone: 0,
            coverColor: '#696969',
            avatarUrl: 'https://i.stack.imgur.com/l60Hf.png',
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        AsyncStorage.getItem('userFirstName').then(firstName => {
            this.setState({firstName: firstName});
        });
        AsyncStorage.getItem('userLastName').then(lastName => {
            this.setState({lastName: lastName});
        });
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('#455a64');
        });
        this._getProfile();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    /**
     * An API call that gets the user's profile info.
     * Currently, it fetches their status message, cover color, and avatar url.
     */
    _getProfile() {
        AsyncStorage.getItem('userToken').then(token => {
            fetch('http://10.0.2.2:8000/user_profile', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token '+ token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    var JSONObject = JSON.parse(response._bodyText);
                    this.setState({
                        statusMessage: JSONObject.status_msg,
                        coverColor: JSONObject.cover_color,
                        avatarUrl: JSONObject.profile_img_url,
                    });
                    AsyncStorage.setItem('userStatusMessage', JSONObject.status_msg);
                    AsyncStorage.setItem('userCoverColor', JSONObject.cover_color);
                    AsyncStorage.setItem('userAvatarUrl', JSONObject.profile_img_url);
                } else {
                    alert("Network Error");
                }
            })
            .catch((error) => {
                console.error(error);
            })
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.cover, { backgroundColor: this.state.coverColor }]} />
                <Image style={styles.avatar} source={{ uri: this.state.avatarUrl }}/>
                <TouchableOpacity style={styles.editProfileButton} onPress={this._goToEditProfile}>
                    <Icon name="md-settings" color="#696969" size={36} />
                </TouchableOpacity>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{`${this.state.firstName} ${this.state.lastName}`}</Text>
                        <Text style={styles.status}>{this.state.statusMessage}</Text>
                        <View style={styles.stats}>
                            <View style={styles.fiasStats}>
                                <Text style={styles.numFias}>{this.state.numFias}</Text>
                                <Text style={styles.fias}>Fias</Text>
                            </View>
                            <View style={styles.ongoingStats}>
                                <Text style={styles.numOngoing}>{this.state.numOngoing}</Text>
                                <Text style={styles.ongoing}>Ongoing</Text>
                            </View>
                            <View style={styles.doneStats}>
                                <Text style={styles.numDone}>{this.state.numDone}</Text>
                                <Text style={styles.done}>Done</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * A function call that switches the screen to the EditProfile screen.
     */
    _goToEditProfile = () => {
        this.props.navigation.navigate('EditProfile');
    };
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
    name: {
        fontSize: 28,
        color: "#000000"
    },
    status: {
        fontSize: 16,
        color: "#455a64",
        marginTop: 15,
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
    editProfileButton: {
        alignSelf: 'flex-end',
        margin: 15,
    }
});
