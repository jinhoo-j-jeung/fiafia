import React, { Component } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput, StatusBar} from 'react-native';
import { ColorWheel } from 'react-native-color-wheel';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import Icon from "react-native-vector-icons/Ionicons";

/**
 * This is a screen for creating a group.
 */
export default class CreateGroupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            color: '#fff',
            groupName: '',
            groupDescription: '',
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor(this.state.color);
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    /**
     * This function converts a HSV color value to a RGB value.
     */
    hsv2rgb(color) {
        var r, g, b, i, f, p, q, t, h;
        if (color.h < 0) {
            h = (color.h + 360) / 360;
        } else {
            h = color.h / 360;
        }
        var s = color.s / 100;
        var v = color.v / 100;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        return "rgba("+r+","+g+","+b+",1)";
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.createGroupText}>Create New Group</Text>
                <View style={styles.groupNameCont}>
                    <TextInput style={styles.groupNameTextBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               onChangeText={ (groupName) => this.setState({groupName})}
                               placeholder="Name your group"
                               placeholderTextColor={"#696969"} />
                </View>
                <View style={styles.groupDescriptionCont}>
                    <TextInput style={styles.groupDescriptionTextBox}
                               underlineColorAndroid={'rgba(0,0,0,0)'}
                               onChangeText={ (groupDescription) => this.setState({groupDescription})}
                               placeholder="Group Description"
                               placeholderTextColor={"#696969"} />
                </View>
                <TouchableOpacity style={[styles.groupColorButton, {backgroundColor: this.state.color}]} onPress={() => { this.setState({ visible: true }); }}>
                    <Text style={styles.groupColorButtonText}>Choose Group Color</Text>
                </TouchableOpacity>
                <View style={styles.navCont}>
                    <TouchableOpacity style={styles.navButton} onPress={() => this.props.navigation.navigate('Group')}>
                        <Icon name="md-close" color="#000000" size={24} />
                        <Text style={styles.navButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton} onPress={() => this.props.navigation.navigate('GroupDetail', {
                        name: this.state.groupName,
                        description: this.state.groupDescription,
                        code: this.state.color
                    })}>
                        <Text style={styles.navButtonText}>Create</Text>
                        <Icon name="md-create" color="#000000" size={24} />
                    </TouchableOpacity>
                </View>
                <Dialog
                    rounded={true}
                    visible={this.state.visible}
                    onTouchOutside={() => {
                        this.setState({ visible: false });
                }}>
                    <DialogContent>
                        <View style={{height: 240, width: 240, alignItems: 'center'}}>
                            <ColorWheel
                                initialColor='#ffffff'
                                onColorChange={ (color) => {
                                    var convertedColor = this.hsv2rgb(color);
                                    this.setState({ color: convertedColor });
                                }}
                                style={{ margin: 10, padding: 20, height: 200, width: 200 }}
                                thumbStyle={{ height: 20, width: 20, borderRadius: 20}} />
                        </View>
                    </DialogContent>
                </Dialog>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createGroupText: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        margin: 10,
        padding: 10,
    },
    groupNameCont: {
        width: "80%",
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    groupNameTextBox: {
        fontSize: 20,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    groupDescriptionCont: {
        width: 360,
        height: 180,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        marginVertical: 20,
    },
    groupDescriptionTextBox: {
        fontSize: 20,
        padding: 10,
    },
    groupColorButton: {
        borderWidth: 1.5,
        borderColor: '#000',
        borderRadius: 10,
        marginVertical: 10,
        elevation: 2,
    },
    groupColorButtonText: {
        fontSize: 16,
        padding: 10,
        color: '#000',
        fontWeight: '500',
    },
    navCont: {
        flexDirection: 'row',
        marginTop: 40,
        alignItems: 'center',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 60,
        borderWidth: 1.5,
        borderColor: '#000',
        borderRadius: 10,
        elevation: 2,
        paddingHorizontal: 10,
    },
    navButtonText: {
        fontSize: 16,
        padding: 10,
        color: '#000',
        fontWeight: '500',
    }
});
