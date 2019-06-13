import React, { Component } from 'react';
import { Text,
         View,
         SafeAreaView,
         FlatList,
         ActivityIndicator,
         Image,
         StyleSheet,
         AsyncStorage,
         StatusBar
} from 'react-native';
import { Card, List, ListItem, Header } from 'react-native-elements';

/**
 * A home screen that renders notifications and feeds from the logged-in user's
 * groups and friends.
 */
export default class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            query: "",
            fullData: [],
            refreshing: false,
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor('#1c313a');
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
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
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
                    loading: false,
                    refreshing: false,
                });
            })
            .catch(error => {
                this.setState({ error, loading: false, refreshing: false });
            });
        }, 500);
    };

    /**
     * A function that refreshes a page by recalling the API.
     */
    handleRefresh = () => {
        this.setState(
            {
                page: 1,
                refreshing: true,
                seed: this.state.seed + 1,
            },
            () => {
                this.makeRemoteRequest();
            }
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

    /**
     * This is a logout function that gets executed when the user clicks
     * the "Logout" button.
     *
     * It deletes the authentication token and leads the user back to the login
     * screen.
     */
    _logout() {
        AsyncStorage.getItem('userToken').then(token => {
            fetch('http://10.0.2.2:8000/user_logout', {
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

    render() {
        return (
            <SafeAreaView style={{marginTop: -10}}>
                <Header
                    leftComponent={{ icon: 'keyboard-return', color: '#fff', onPress: this._logout.bind(this) }}
                    rightComponent={{ icon: 'refresh', color: '#fff', onPress: this.handleRefresh }}
                    centerComponent={{ text: 'FiaFia', style: {color: '#fff', fontSize: 20, fontWeight: 'bold'} }}
                    backgroundColor='#1c313a'
                />
                <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: -10 }}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <Card
                                containerStyle={{}}
                                wrapperStyle={{}}
                            >
                                <ListItem
                                    key={item.email}
                                    title="Group Name"
                                    containerStyle={styles.groupInfo}
                                    avatar={{ uri: 'https://noblehour.com/public/layouts/images/group-default-logo.png' }}
                                    roundAvatar
                                    onPress={() => this.props.navigation.navigate('HomeGroupDetail', {
                                        userFirstName: item.name.first,
                                        userLastName: item.name.last,
                                        userAvatarUrl: item.picture.large,
                                    })}
                                />
                                <View style={styles.userInfoCont}>
                                    <Image
                                        style={styles.userAvatarImage}
                                        source={{uri: item.picture.large}}
                                    />
                                    <View style={styles.userInfoContChild}>
                                        <Text style={styles.username}>{`${item.name.first} ${item.name.last}`}</Text>
                                        <Text style={{marginVertical: 5}}>1 hour ago</Text>
                                    </View>
                                </View>
                                <Text style={{marginVertical: 10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At elementum eu facilisis sed odio morbi. Tempus urna et pharetra pharetra massa massa ultricies mi. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis.</Text>
                            </Card>
                        )}
                        keyExtractor={item => item.email}
                        ListFooterComponent={this.renderFooter}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                </List>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    groupInfo: {
        marginTop: -10,
        padding: 10,
        width: "110%",
        alignSelf: 'center',
    },
    userInfoCont: {
        flexDirection: 'row',
        marginTop: 15,
    },
    userAvatarImage: {
        width: 50,
        height: 50,
        borderRadius: 50/2,
    },
    userInfoContChild: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
