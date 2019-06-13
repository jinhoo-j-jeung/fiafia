import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';

import _ from 'lodash';

import { contains, getGroups, groups } from '../src/api/GetGroups';

/**
 * A second tab in the top tab in the search screen.
 * It has a search bar in which the user can search for a specific group.
 */
export default class SearchGroupScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
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
                    containerStyle={{backgroundColor: '#ffffff', borderTopWidth: 0, borderBottomWidth: 0, marginBottom: -5}}
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
                                key={item.name}
                                title={item.name}
                                subtitle={item.description}
                                avatar={{ uri: item.image_url }}
                                containerStyle={{ borderBottomWidth: 0 }}
                                onPress={() => this.props.navigation.navigate('SearchGroupDetail', {
                                    name: item.name,
                                    code: item.code,
                                    description: item.description,
                                    image_url: item.image_url,
                                })}
                            />
                        )}
                        keyExtractor={item => item.name}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                    />
                </List>
            </SafeAreaView>
        );
    }
}
