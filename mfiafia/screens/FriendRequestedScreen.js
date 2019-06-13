import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';

import _ from 'lodash';

import { getUsers, contains } from '../src/api/GetUsers';

/**
 * A friend screen that renders a list of users whom the logged-in user sent a friend request.
 * It also has a search bar in which the user can search for a specific user.
 */
export default class FriendRequestedScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 4,
            error: null,
            query: "",
            fullData: [],
        };
    }

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
     * An API call to fetch a list of the user's friends.
     * Currently, it is using the Randomuser.me API as a placeholder.
     */
    makeRemoteRequest = () => {
        const { page, seed } = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=2`;
        this.setState({ loading: true });

        // setting the timeout allows the loading to be smoooth
        // in case we need to handle "loading more" on scroll when we have a large list
        setTimeout(() => {
            fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: [...this.state.data, ...res.results],
                    fullData: [...this.state.data, ...res.results],
                    error: res.error || null,
                    loading: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
        }, 500);
    };

    /**
     * A filtering for search.
     */
    handleSearch = text => {
        const formatQuery = text.toLowerCase();
        const data = _.filter(this.state.fullData, user => {
            return contains(user, formatQuery);
        });
        this.setState({ query: formatQuery, data });
    }

    /**
     * Currently, it is not being used.
     * In the future, this is necessary for loading more data on scroll.
     */
    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1,
        }, () => {
            this.makeRemoteRequest();
        });
    }

    /**
     * A function that calls a view which renders a separator between each list item.
     */
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    /**
     * A function that calls a view which renders a search bar.
     */
    renderHeader = () => {
        return (
            <View>
                <SearchBar
                    inputStyle={{backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#1c313a', borderRadius: 10}}
                    containerStyle={{backgroundColor: '#ffffff', borderTopColor: '#f2f2f2', borderBottomWidth: 0, marginBottom: -5}}
                    placeholder="Search..."
                    onChangeText={this.handleSearch}
                />
            </View>
        );
    };

    /**
     * A function that calls a view which renders an animating loading icon.
     */
    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
             <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    render() {
        return (
            <SafeAreaView>
                <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <ListItem
                                roundAvatar
                                key={item.email}
                                title={`${item.name.first} ${item.name.last}`}
                                subtitle={item.email}
                                avatar={{ uri: item.picture.thumbnail }}
                                containerStyle={{ borderBottomWidth: 0 }}
                                onPress={() => this.props.navigation.navigate('FriendDetail', {
                                    userFirstName: item.name.first,
                                    userLastName: item.name.last,
                                    userAvatarUrl: item.picture.large,
                                })}
                            />
                        )}
                        keyExtractor={item => item.email}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                    />
                </List>
            </SafeAreaView>
        );
    }
}
