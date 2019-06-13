import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Button,
    AsyncStorage,
    StatusBar,
    Image,
    FlatList
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { List, ListItem, Card } from "react-native-elements";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { getUsers } from "../src/api/GetUsers";
import ActionButton from 'react-native-action-button';
import Icon from "react-native-vector-icons/Ionicons";

const deadline = {key:'deadline', color: 'red', selectedDotColor: 'red'};
const weekly = {key:'weekly', color: 'blue', selectedDotColor: 'blue'};
const monthly = {key:'monthly', color: 'green'};

/**
 * A group page screen for a specific group.
 */
export default class GroupDetailScreen extends Component {

    constructor(){
        super();
        this.state = {
            selectedIndex: 0,
            membership: 1,
            loading: false,
            data: [],
            error: null,
            query: "",
            fullData: [],
            data2: [],
            fullData2: [],
            page: 1,
            seed: 1,
            avatarUrl: '',
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('userFirstName').then(firstName => {
            this.setState({firstName: firstName});
        });
        AsyncStorage.getItem('userLastName').then(lastName => {
            this.setState({lastName: lastName});
        });
        AsyncStorage.getItem('userAvatarUrl').then(avatarUrl => {
            this.setState({avatarUrl: avatarUrl});
        });
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor(this.props.navigation.getParam('code', '#ffffff'));
        });
        this.makeRemoteRequest();
        this.makeRemoteRequest2();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    /**
     * An API call to get members of the group.
     */
    makeRemoteRequest = () => {
        this.setState({ loading: true });

        getUsers()
            .then(users => {
                this.setState({
                    loading: false,
                    data: users,
                    fullData: users,
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    /**
     * An API call to get notifications of the group.
     */
    makeRemoteRequest2 = () => {
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
                    data2: [...this.state.data2, ...res.results],
                    fullData2: [...this.state.data2, ...res.results],
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
     * onPress function to navigate tabs
     */
    handleIndexChange = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };

    /**
     * onPress function to toggle 'Join' button view according to the user's membership status
     */
    handleMembership = () => {
        if(this.state.membership === 1) {
            this.setState({
                membership: 0
            })
        }
        else if(this.state.membership === 0) {
            this.setState({
                membership: 1
            })
        }
        else {
            alert("Confirm Deleting the Project?")
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.container1, { backgroundColor: this.props.navigation.getParam('code', '#ffffff') }]}>
                    <View style={[styles.sharedContainer]}>
                        <Image source={{uri : this.props.navigation.getParam('image_url', 'No Project Name')}} style={styles.groupImage}/>
                        <View style={styles.nameContainer}>
                            <Text style={styles.groupName}>{this.props.navigation.getParam('name', 'No Project Name')}</Text>
                            <Text style={styles.groupDescription}>{this.props.navigation.getParam('description', 'No Description Available')}</Text>
                        </View>
                    </View>
                    <View>
                        {this.state.membership === 0
                            ? (<TouchableOpacity style={[styles.joinProjectButton]} onPress={this.handleMembership}>
                                    <Text style={[styles.buttonTextStyle]}>JOIN</Text>
                                </TouchableOpacity>
                            )
                            : this.state.membership === 1
                            ? (
                                <View style={[styles.membershipView]}>
                                    <View style={[styles.membershipStatus,  { backgroundColor: this.props.navigation.getParam('code', '#ffffff') }]}>
                                        <Text style={[styles.buttonTextStyle]}>MEMBER</Text>
                                    </View>
                                    <TouchableOpacity style={[styles.joinProjectButton]} onPress={this.handleMembership}>
                                        <Text style={[styles.buttonTextStyle]}>LEAVE</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                            : (
                                <View style={[styles.membershipView]}>
                                    <View style={[styles.membershipStatus,  { backgroundColor: this.props.navigation.getParam('code', '#ffffff') }]}>
                                        <Text style={[styles.buttonTextStyle]}>ADMIN</Text>
                                    </View>
                                    <TouchableOpacity style={[styles.joinProjectButton]} onPress={this.handleMembership}>
                                        <Text style={[styles.buttonTextStyle]}>DELETE</Text>
                                    </TouchableOpacity>
                                </View>
                                )
                        }
                    </View>
                </View>
                <View style={styles.container2}>
                    <SegmentedControlTab
                        values={['Home', 'Members', 'Agenda']}
                        tabStyle={[styles.tabStyle, { backgroundColor: this.props.navigation.getParam('code', '#ffffff') }]}
                        tabTextStyle={styles.tabTextStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTabTextStyle={[styles.activeTabTextStyle, {color: this.props.navigation.getParam('code', '#ffffff')}]}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this.handleIndexChange}
                    />
                </View>
                <View style={styles.container3}>
                    { this.state.selectedIndex === 0
                        ? ( <View style={styles.container3}>
                                <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: -10 }}>
                                    <FlatList
                                        data={this.state.data2}
                                        renderItem={({ item }) => (
                                            <Card
                                                containerStyle={{}}
                                                wrapperStyle={{}}
                                            >
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
                                    />
                                </List>
                                <ActionButton
                                    buttonColor="#fa8072"
                                    size={50}
                                    icon={<Icon name="md-chatboxes" style={styles.actionButtonIcon}/>}
                                    onPress={this._goToCreateMessage}>
                                </ActionButton>
                            </View>
                        )
                        : this.state.selectedIndex === 1
                        ? (<List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: -10 }}>
                                <FlatList
                                    data={this.state.data}
                                    renderItem={({ item }) => (
                                        <ListItem
                                            roundAvatar
                                            title={`${item.name.first} ${item.name.last}`}
                                            subtitle={item.email}
                                            avatar={{ uri: item.avatar_url}}
                                            containerStyle={{ borderBottomWidth: 0 }}
                                        />
                                    )}
                                    keyExtractor={item => item.email}
                                    ItemSeparatorComponent={this.renderSeparator}
                                />
                            </List>
                        )
                        : (<View style={styles.container3}>
                            <Calendar
                                markedDates={{
                                    '2018-12-14': {dots: [deadline], selected: true, selectedColor: 'red'},
                                    '2018-12-15': {dots: [weekly, monthly], selected: true},
                                    '2018-12-22': {dots: [weekly]},
                                    '2018-12-08': {dots: [weekly]},
                                }}
                            markingType={'multi-dot'}
                            />
                            </View>
                        )
                    }
                </View>
            </View>
        )
    }

    /**
     * A function call that switches the screen to the CreateMessage screen.
     */
    _goToCreateMessage = () => {
        this.props.navigation.navigate('CreateMessage', {
            username: 'user1',
            group_url: this.props.navigation.getParam('image_url', 'No Project Name'),
            group_color: this.props.navigation.getParam('code', '#ffffff'),
            group_name: this.props.navigation.getParam('name', 'No Project Name'),
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
    },
    container1: {
        flex:4,
        alignSelf: 'stretch',
        padding: 10
    },
    sharedContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    groupImage: {
        alignSelf:'flex-start',
        width: 120,
        height: 120,
        borderRadius: 80/2,
        padding: 10
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'column',
        marginStart: 10
    },
    groupName: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
    },
    groupDescription: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
        flexWrap: 'wrap'
    },
    membershipStatus: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        borderColor: '#fa8072',
        borderWidth: 2,
        padding: 5,
        marginEnd: 5,
        borderRadius: 60/2,
        width: 100,
    },
    joinProjectButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        borderColor: '#fff',
        backgroundColor: '#fa8072',
        padding: 5,
        marginEnd: 5,
        borderRadius: 60/2,
        width: 100,
    },
    buttonTextStyle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
    },
    membershipView: {
      flexDirection: 'row',
      alignSelf: 'flex-end'
    },
    container2: {
        flex:1,
        alignSelf: 'stretch',
        height: 70,
    },
    tabStyle: {
        //custom styles
        borderWidth: 1,
        borderColor: '#fff'
    },
    tabTextStyle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff'
    },
    activeTabStyle: {
        //custom styles
        backgroundColor: '#fff'
    },
    activeTabTextStyle: {
        fontWeight: '600',
        fontSize: 16,
    },
    container3: {
        flex: 7,
        alignSelf: 'stretch'
    },
    actionButtonIcon: {
        fontSize: 35,
        color: 'white',
    },
    userInfoCont: {
        flexDirection: 'row',
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
