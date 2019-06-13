import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Text } from 'react-native';

import Logo from '../src/components/Logo';

/**
 * A splash screen that checks for the authentication token.
 * If the user is logged in, starting the app should lead to the main screen.
 * If the user is not logged in, it should lead to the login screen.
 * On loading, the logo appears in the middle of the screen.
 */
export default class AuthLoadingScreen extends Component {

    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#455a64"
                    barStyle="default"
                    hidden={true} />
                <Logo />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#455a64',
    }
});
