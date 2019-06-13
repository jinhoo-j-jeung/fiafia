import React, { Component } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput, Image, StatusBar} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * This is a screen for creating a message/post in the group.
 */
export default class CreateMessageScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            username: '',
            content: '',
            email: '',
            password: '',
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('userEmail').then(userEmail => {
            this.setState({'email': userEmail});
        });
        AsyncStorage.getItem('username').then(username => {
            this.setState({'username': username});
        });
        AsyncStorage.getItem('userID').then(userid => {
            this.setState({'userID': userid});
        });
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor(this.props.navigation.getParam('group_color', '#ffffff'));
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.props.navigation.getParam('group_color', '#ffffff') }]}>
                <Text style={styles.message}>New Message</Text>
                <View style={styles.messageCont}>
                    <View style={styles.messageInfoCont}>
                        <Image source={{uri : this.props.navigation.getParam('group_url', 'No Project Name')}} style={styles.profileImage}/>
                        <Text style={styles.texttext}>from.</Text>
                        <Text style={styles.username}>{this.props.navigation.getParam('username', 'user')}</Text>
                    </View>
                    <TextInput style={styles.messageContent}
                               onChangeText={ (content) => this.setState({content})}/>
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={this._goBack}>
                    <Text style={styles.sendText}>SEND</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * A function call that switches back to GroupDetail screen.
     */
    _goBack = () => {
        this.props.navigation.navigate('GroupDetail');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        margin: 10,
        padding: 10,
    },
    messageCont: {
        width: 360,
        height: 360,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    messageInfoCont: {
        width: 340,
        height: 80,
        flexDirection: 'row',
    },
    profileImage: {
        alignSelf:'flex-start',
        width: 60,
        height: 60,
        borderRadius: 60/2,
        margin: 10
    },
    messageContent: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        fontSize: 20,
        color: '#000',
        width: 340,
        height: 250
    },
    texttext: {
        color: '#fff',
        fontSize: 20,
        fontStyle: 'italic',
        margin: 10,
        padding: 10,
    },
    username: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        margin: 10,
        padding: 10,
    },
    sendText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    sendButton: {
        width: 100,
        height: 40,
        padding: 5,
        marginHorizontal: 25,
        marginVertical: 10,
        backgroundColor: '#455a64',
        borderRadius: 10,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
});
