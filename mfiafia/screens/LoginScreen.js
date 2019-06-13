import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, AsyncStorage, TextInput, StatusBar } from 'react-native';

import Logo from '../src/components/Logo';

/**
 * A login screen that allows a user to login with an email and password.
 * It is the very first screen of the app.
 */
export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#455a64"
                    barStyle="default" />
                <View style={styles.header}>
                    <Logo />
                </View>
                <View style={styles.body}>
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               selectionColor={"#ffffff"}
                               keyboardType={"email-address"}
                               onSubmitEditing={() => this.password.focus()}
                               onChangeText={ (email) => this.setState({email})}
                               placeholder={"Email"}
                               placeholderTextColor={"#ffffff"} />
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               secureTextEntry={true}
                               ref={(input) => this.password = input}
                               onChangeText={ (password) => this.setState({password})}
                               placeholder={"Password"}
                               placeholderTextColor={"#ffffff"} />
                   <TouchableOpacity style={styles.button} onPress={this._loginAsync.bind(this)}>
                       <Text style={styles.buttonText}>LOG IN</Text>
                   </TouchableOpacity>
                </View>
                <View style={styles.forgotPasswordTextCont}>
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.signUpTextCont}>
                    <Text style={styles.signUpText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={this._goToRegister}>
                        <Text style={styles.signUpButton}> Create one</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    /**
     * A function call that switches the screen to the Register screen.
     */
    _goToRegister = () => {
        this.props.navigation.navigate('Register');
    };

    /**
     * This is a login function that gets executed when the user clicks
     * the "Log In" button.
     *
     * It checks if the email and password inputs are indeed in the database.
     * If it is, it saves the user's token and leads the user to the home screen.
     * If the email does not exist or password does not match with the email,
     * authentication should fail and notify the user.
     */
    _loginAsync = async () => {
        fetch('http://10.0.2.2:8000/user_login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        })
        .then((response) => {
            if (response.status === 200) {
                var JSONObject = JSON.parse(response._bodyText);
                AsyncStorage.setItem('userToken', JSONObject.token);
                AsyncStorage.setItem('username', JSONObject.username);
                AsyncStorage.setItem('userEmail', JSONObject.email);
                AsyncStorage.setItem('userFirstName', JSONObject.first_name);
                AsyncStorage.setItem('userLastName', JSONObject.last_name);
                AsyncStorage.setItem('userID', JSON.stringify(JSONObject.user_id));
                this.props.navigation.navigate('App');
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#455a64',
    },
    header: {
        height: 150,
        marginTop: 100,
    },
    body: {
        marginVertical: 30,
    },
    forgotPasswordTextCont: {
        width: 300,
        marginVertical: -30,
        textAlign: 'left'
    },
    forgotPasswordText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
    },
    signUpTextCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: 24,
        flexDirection: 'row'
    },
    signUpText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16
    },
    signUpButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    button: {
        width: 300,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
    }
});
