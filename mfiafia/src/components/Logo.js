import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Logo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={{width: 100, height: 100}} source={require('../images/icon.png')}/>
                <Text style={styles.logoText}>fiafia</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        marginVertical: 5,
        fontSize: 36,
        color: 'rgba(255, 255, 255, 0.7)'
    }
});
