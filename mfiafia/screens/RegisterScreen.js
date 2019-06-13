import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, AsyncStorage, StatusBar } from 'react-native';

/**
 * A register screen allowing a user to sign up.
 */
export default class RegisterScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            username: '',
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
                <View style={styles.body}>
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               selectionColor={"#ffffff"}
                               placeholder={"First Name"}
                               placeholderTextColor={"#ffffff"}
                               onChangeText={ (firstName) => this.setState({firstName})}
                               ref={(input) => this.firstName = input}
                               onSubmitEditing={() => this.lastName.focus()} />
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               selectionColor={"#ffffff"}
                               placeholder={"Last Name"}
                               placeholderTextColor={"#ffffff"}
                               onChangeText={ (lastName) => this.setState({lastName})}
                               ref={(input) => this.lastName = input}
                               onSubmitEditing={() => this.username.focus()} />
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               selectionColor={"#ffffff"}
                               placeholder={"Username"}
                               placeholderTextColor={"#ffffff"}
                               onChangeText={ (username) => this.setState({username})}
                               ref={(input) => this.username = input}
                               onSubmitEditing={() => this.email.focus()} />
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               selectionColor={"#ffffff"}
                               placeholder={"Email"}
                               placeholderTextColor={"#ffffff"}
                               keyboardType={"email-address"}
                               onChangeText={ (email) => this.setState({email})}
                               ref={(input) => this.email = input}
                               onSubmitEditing={() => this.password.focus()} />
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               placeholder={"Password"}
                               placeholderTextColor={"#ffffff"}
                               secureTextEntry={true}
                               onChangeText={ (password) => this.setState({password})}
                               ref={(input) => this.password = input}
                               onSubmitEditing={() => this.confirmPassword.focus()} />
                    <TextInput style={styles.inputBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               placeholder={"Confirm Password"}
                               placeholderTextColor={"#ffffff"}
                               secureTextEntry={true}
                               onChangeText={ (confirmPassword) => this.setState({confirmPassword})}
                               ref={(input) => this.confirmPassword = input} />
                    <TouchableOpacity style={styles.button} onPress={this._registerAsync.bind(this)}>
                        <Text style={styles.buttonText}>REGISTER</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.registerTextCont}>
                    <Text style={styles.registerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={this._goToLogin}>
                        <Text style={styles.registerButton}> Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    /**
     * A function call that switches the screen to the Login screen.
     */
    _goToLogin = () => {
        this.props.navigation.navigate('Login');
    };

    /**
     * This is a register function that gets executed when the user clicks
     * the "Register" button.
     *
     * It checks if the email is already in the database.
     * If it is not, it saves the user's token and leads the user to the home screen.
     * If the email already exists, it should notify the user.
     */
    _registerAsync = async () => {
        fetch('http://10.0.2.2:8000/user_register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName
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
            } else if (response.status === 400) {
                alert("Email already exists! Try different email.");
            } else if (this.state.password !== this.state.confirmPassword) {
                alert("Password does not match!");
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
        backgroundColor: '#455a64'
    },
    body: {
        marginVertical: 60,
    },
    registerTextCont: {
        flexDirection: 'row',
    },
    registerText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
    },
    registerButton: {
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
