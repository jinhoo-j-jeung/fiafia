import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import GridView from 'react-native-super-grid';
import { SearchBar } from "react-native-elements";
import ActionButton from 'react-native-action-button';

import _ from 'lodash';

import Icon from 'react-native-vector-icons/Ionicons';

import { contains, getGroups, groups } from '../src/api/GetGroups';

/**
 * A group screen that renders a grid view of the logged-in user's groups.
 * It also has a search bar in which the user can search for a specific group.
 */
export default class GroupScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            error: null,
            query: "",
            fullData: [],
        };
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor('#ffffff');
        });
        this.makeRemoteRequest();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    /**
     * An API call to fetch a list of the user's groups.
     * Currently, it is not using an API but a list from local.
     */
    makeRemoteRequest = () => {
        this.setState({ loading: true });

        getGroups()
        .then(groups => {
            this.setState({
                loading: false,
                data: groups,
                fullData: groups,
            });
        })
        .catch(error => {
            this.setState({ error, loading: false });
        });
    };

    /**
     * A filtering for search.
     */
    handleSearch = text => {
        const formatQuery = text.toLowerCase();
        const data = _.filter(this.state.fullData, group => {
            return contains(group, formatQuery);
        });
        this.setState({ query: formatQuery, data });
    };

    /**
     * A function that calls a view which renders a search bar.
     */
    renderHeader = () => {
        return (
            <View>
                <SearchBar
                    inputStyle={{backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#1c313a', borderRadius: 10}}
                    containerStyle={{backgroundColor: '#ffffff', borderTopColor: '#f2f2f2', borderBottomWidth: 0}}
                    placeholder="Search..."
                    onChangeText={this.handleSearch}
                />
            </View>
        );
    };

    render() {
        return (
            <View style={{flex:1}}>
                <GridView
                    ListHeaderComponent={this.renderHeader}
                    itemDimension={130}
                    items={this.state.data}
                    style={styles.gridView}
                    renderItem={item => (
                        <TouchableOpacity style={[styles.itemContainer, { backgroundColor: item.code }]} onPress={() => this.props.navigation.navigate('GroupDetail', {
                            name: item.name,
                            code: item.code,
                            description: item.description,
                            image_url: item.image_url})}>
                            <Image source={{uri : item.image_url}}
                                   style={styles.itemImage}/>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.name}
                    />
                <ActionButton
                    buttonColor="#fa8072"
                    size={70}
                    icon={<Icon name="md-create" style={styles.actionButtonIcon}/>}
                    onPress={this._goToCreateGroup}>
                </ActionButton>
            </View>
        );
    }

    /**
     * A function call that switches the screen to the CreateGroup screen.
     */
    _goToCreateGroup = () => {
        this.props.navigation.navigate('CreateGroup', {
            username: 'user1',
            group_url: this.props.navigation.getParam('image_url', 'No Project Name'),
            group_color: this.props.navigation.getParam('code', '#000'),
            group_name: this.props.navigation.getParam('name', 'No Project Name'),
        });
    }
}

const styles = StyleSheet.create({
    gridView: {
        paddingTop: 5,
        flex: 1,
    },
    itemContainer: {
        //justifyContent: 'flex-end',
        alignContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemImage: {
        flexDirection: 'row',
        alignSelf:'center',
        width: 66,
        height: 66,
        borderRadius: 66/2,
        padding: 10
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemDescription: {
        fontWeight: '600',
        fontSize: 14,
        color: '#fff',
    },
    actionButtonIcon: {
        fontSize: 35,
        color: 'white',
    },
});
