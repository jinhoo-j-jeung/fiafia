import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput, StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * This is a screen for editing the logged-in user's profile.
 * They can change their profile information, as well as deleting the account.
 */
export default class EditProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            username: '',
            newUsername: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            newFirstName: '',
            newLastName: '',
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        AsyncStorage.getItem('userEmail').then(userEmail => {
            this.setState({'email': userEmail});
        });
        AsyncStorage.getItem('username').then(username => {
            this.setState({'username': username});
        });
        AsyncStorage.getItem('userFirstName').then(firstName => {
            this.setState({'firstName': firstName});
        });
        AsyncStorage.getItem('userLastName').then(lastName => {
            this.setState({'lastName': lastName});
        });
        AsyncStorage.getItem('userID').then(userid => {
            this.setState({'userID': userid});
        });
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('#ffffff');
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.emailCont}>
                    <Text style={styles.email}>Email</Text>
                    <TextInput style={styles.emailText}
                               editable={false}
                               value={this.state.email} />
                </View>
                <View style={styles.usernameCont}>
                    <Text style={styles.username}>First Name</Text>
                    <TextInput style={styles.usernameText}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               onChangeText={ (newFirstName) => this.setState({newFirstName})}
                               placeholder={this.state.firstName}
                               placeholderTextColor={"#696969"} />
                    <TouchableOpacity style={styles.changeUsernameButton} onPress={this._changeUsernameAsync.bind(this)}>
                        <Icon name="ios-paper-plane" color="#ffffff" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.usernameCont}>
                    <Text style={styles.username}>Last Name</Text>
                    <TextInput style={styles.usernameText}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               onChangeText={ (newLastName) => this.setState({newLastName})}
                               placeholder={this.state.lastName}
                               placeholderTextColor={"#696969"} />
                    <TouchableOpacity style={styles.changeUsernameButton} onPress={this._changeUsernameAsync.bind(this)}>
                        <Icon name="ios-paper-plane" color="#ffffff" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.usernameCont}>
                    <Text style={styles.username}>Username</Text>
                    <TextInput style={styles.usernameText}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               onChangeText={ (newUsername) => this.setState({newUsername})}
                               placeholder={this.state.username}
                               placeholderTextColor={"#696969"} />
                    <TouchableOpacity style={styles.changeUsernameButton} onPress={this._changeUsernameAsync.bind(this)}>
                        <Icon name="ios-paper-plane" color="#ffffff" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordCont}>
                    <Text style={styles.password}>Password</Text>
                    <TextInput style={styles.passwordText}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               secureTextEntry={true}
                               onChangeText={ (password) => this.setState({password})}
                               placeholder={"******"}
                               placeholderTextColor={"#696969"} />
                    <TouchableOpacity style={styles.changePasswordButton} onPress={this._resetPasswordAsync.bind(this)}>
                        <Icon name="ios-paper-plane" color="#ffffff" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.deleteAccountCont}>
                    <TouchableOpacity style={styles.deleteAccountButton} onPress={this._deleteAccount.bind(this)}>
                        <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * An API call for changing the username.
     */
    _changeUsernameAsync = async () => {
        let formdata = new FormData();
        formdata.append("new_username", this.state.newUsername);
        fetch('http://10.0.2.2:8000/user/'+this.state.userID+'/change_username/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: formdata
        })
        .then((response) => {
            if (response.status === 200) {
                alert("Username has successfully changed!");
                AsyncStorage.setItem('username', this.state.newUsername);
            } else if (response.status === 404) {
                alert("No such user");
            } else if (response.status === 500) {
                alert("Username already exists.")
            } else {
                alert("Username must be at least 4 characters long.");
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    /**
     * An API call for changing the password.
     * It also logs out the user because the authentication token must be changed.
     */
    _resetPasswordAsync = async () => {
        let formdata = new FormData();
        formdata.append("new_pw", this.state.password);
        fetch('http://10.0.2.2:8000/user/'+this.state.userID+'/reset_password/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: formdata
        })
        .then((response) => {
            if (response.status === 200) {
                alert("Password has successfully changed!\nPlease relog in with your new password.");
                AsyncStorage.clear();
                this.props.navigation.navigate('Auth');
            } else if (response.status === 404) {
                alert("No such user");
            } else {
                alert("Password must be at least 6 characters long.");
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    /**
     * This is a delete account function that gets executed when the user clicks
     * the "Delete Account" button.
     *
     * It deletes the authentication token and leads the user back to the login
     * screen. Plus, it completely removes the user's data from the database.
     */
    _deleteAccount() {
        AsyncStorage.getItem('userToken').then(token => {
            fetch('http://10.0.2.2:8000/user_delete', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token '+ token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Auth');
                } else {
                    alert("Network Error");
                }
            })
            .catch((error) => {
                console.error(error);
            })
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailCont: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    email: {
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
        margin: 10,
        padding: 10,
    },
    emailText: {
        width: 200,
        fontSize: 20,
        marginLeft: 0,
        marginRight: 10,
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    usernameCont: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
        margin: 10,
        padding: 10,
    },
    usernameText: {
        width: 200,
        fontSize: 20,
        marginLeft: 0,
        marginRight: 10,
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    changeUsernameButton: {
        width: 40,
        height: 40,
        backgroundColor: '#455a64',
        borderRadius: 20,
    },
    passwordCont: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    password: {
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
        margin: 10,
        padding: 10,
    },
    passwordText: {
        width: 200,
        fontSize: 20,
        marginLeft: 0,
        marginRight: 10,
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    changePasswordButton: {
        width: 40,
        height: 40,
        backgroundColor: '#455a64',
        borderRadius: 20,
    },
    deleteAccountCont: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
    },
    deleteAccountButton: {
        backgroundColor: 'red',
        borderRadius: 10,
        margin: 10,
        padding: 10
    },
    deleteAccountButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
    }
})
