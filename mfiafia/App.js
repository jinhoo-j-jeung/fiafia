import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { createSwitchNavigator,
         createStackNavigator,
         createMaterialTopTabNavigator,
         createAppContainer
} from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeScreen from './screens/HomeScreen';
import SearchUserScreen from './screens/SearchUserScreen';
import SearchGroupScreen from './screens/SearchGroupScreen';
import FriendScreen from './screens/FriendScreen';
import FriendRequestedScreen from './screens/FriendRequestedScreen';
import FriendReceivedScreen from './screens/FriendReceivedScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import GroupScreen from './screens/GroupScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import GroupDetailScreen from './screens/GroupDetailScreen';
import CreateMessageScreen from './screens/CreateMessageScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * FiaFia: Project-Based Social Networking App
 *
 * FiaFia is a simple react native app that allows users to connect based on
 * their interested projects. One can create and maintain a group for a personal
 * project, research project, etc. Others can join the group and be a part of
 * the group.
 *
 * TL;DR This app allows a comfortable user experience for someone who needs to
 * keep track of their projects.
 *
 * @author    Min Seok Choi, Jinhoo Jeung
 * @version   1.0
 * @since     2018-12-05
 */
export default class App extends Component {
    render () {
        return (
            <SafeAreaView style={{ flex:1, backgroundColor: '#ffffff' }}>
                <AppStackNavigator/>
            </SafeAreaView>
        )
    }
}

/**
 * A home tab/screen.
 * It has two screens: HomeScreen and GroupDetailScreen.
 * Clicking a specific group (list item) should navigate to that group's page.
 */
const HomeStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        HomeGroupDetail: {
            screen: UserDetailScreen,
        }
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="md-home" color={tintColor} size={28} />
            )
        }
    }
)

/**
 * A search user tab in a search tab.
 * It has two screens: SearchUserScreen and UserDetailScreen.
 * Clicking a specific user (list item) should navigate to that user's page.
 */
const SearchUserStack = createStackNavigator(
    {
        SearchUser: {
            screen: SearchUserScreen,
        },
        SearchUserDetail: {
            screen: UserDetailScreen,
        }
    },
    {
        initialRouteName: 'SearchUser',
        headerMode: 'none',
    }
)

// Makes the top tab invisible when viewing the user page.
SearchUserStack.navigationOptions = ({ navigation }) => {
    if(navigation.state.index==1){
        return {
            tabBarVisible: false,
        };
    }
    return {
        tabBarVisible: true,
        tabBarLabel: 'Users',
    };
};

/**
 * A search group tab in a search tab.
 * It has two screens: SearchGroupScreen and GroupDetailScreen.
 * Clicking a specific group (list item) should navigate to that group's page.
 */
const SearchGroupStack = createStackNavigator(
    {
        SearchGroup: {
            screen: SearchGroupScreen,
        },
        SearchGroupDetail: {
            screen: GroupDetailScreen,
        }
    },
    {
        initialRouteName: 'SearchGroup',
        headerMode: 'none',
    }
)

// Makes the top tab invisible when viewing the group page.
SearchGroupStack.navigationOptions = ({ navigation }) => {
    if(navigation.state.index==1){
        return {
            tabBarVisible: false,
        };
    }
    return {
        tabBarVisible: true,
        tabBarLabel: 'Groups',
    };
};

/**
 * A search tab/screen.
 * It has two screens: SearchUserStack and SearchGroupStack.
 * It has a top tab navigator that allows an easy navigation between them.
 */
const SearchStack = createMaterialTopTabNavigator(
    {
        SearchUser: SearchUserStack,
        SearchGroup: SearchGroupStack,
    },
    {
        initialRouteName: 'SearchUser',
        headerMode: 'none',
        navigationOptions: {
            tabBarLabel: 'Search',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="md-search" color={tintColor} size={28} />
            )
        },
        tabBarOptions: {
            activeTintColor: '#1c313a',
            inactiveTintColor: 'grey',
            style: {
                backgroundColor: '#ffffff',
                marginBottom: -20,
                borderTopWidth: 1,
                borderColor: '#f2f2f2',
            },
            indicatorStyle: {
                backgroundColor: '#1c313a',
            },
            labelStyle: {
                fontSize: 16,
            },
            upperCaseLabel: false,
        }
    }
)

const MyFriendStack = createStackNavigator(
    {
        Friend: {
            screen: FriendScreen,
        },
        FriendDetail: {
            screen: UserDetailScreen,
        }
    },
    {
        initialRouteName: 'Friend',
        headerMode: 'none',
    }
)

// Makes the top tab invisible when viewing the user page.
MyFriendStack.navigationOptions = ({ navigation }) => {
    if(navigation.state.index==1){
        return {
            tabBarVisible: false,
        };
    }
    return {
        tabBarVisible: true,
        tabBarLabel: 'Fias',
    };
};

const FriendRequestedStack = createStackNavigator(
    {
        FriendRequested: {
            screen: FriendRequestedScreen,
        },
        FriendDetail: {
            screen: UserDetailScreen,
        }
    },
    {
        initialRouteName: 'FriendRequested',
        headerMode: 'none',
    }
)

// Makes the top tab invisible when viewing the user page.
FriendRequestedStack.navigationOptions = ({ navigation }) => {
    if(navigation.state.index==1){
        return {
            tabBarVisible: false,
        };
    }
    return {
        tabBarVisible: true,
        tabBarLabel: 'Requested',
    };
};

const FriendReceivedStack = createStackNavigator(
    {
        FriendReceived: {
            screen: FriendReceivedScreen,
        },
        FriendDetail: {
            screen: UserDetailScreen,
        }
    },
    {
        initialRouteName: 'FriendReceived',
        headerMode: 'none',
    }
)

// Makes the top tab invisible when viewing the user page.
FriendReceivedStack.navigationOptions = ({ navigation }) => {
    if(navigation.state.index==1){
        return {
            tabBarVisible: false,
        };
    }
    return {
        tabBarVisible: true,
        tabBarLabel: 'Received',
    };
};

/**
 * A friend tab/screen.
 * It has two screens: FriendScreen and UserDetailScreen.
 * Clicking a specific user (list item) should navigate to that user's page.
 */
const FriendStack = createMaterialTopTabNavigator(
    {
        Friend: MyFriendStack,
        FriendRequested: FriendRequestedStack,
        FriendReceived: FriendReceivedStack,
    },
    {
        initialRouteName: 'Friend',
        headerMode: 'none',
        navigationOptions: {
            tabBarLabel: 'Fias',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="md-contacts" color={tintColor} size={28} />
            )
        },
        tabBarOptions: {
            activeTintColor: '#1c313a',
            inactiveTintColor: 'grey',
            style: {
                backgroundColor: '#ffffff',
                marginBottom: -20,
                borderTopWidth: 1,
                borderColor: '#f2f2f2',
            },
            indicatorStyle: {
                backgroundColor: '#1c313a',
            },
            labelStyle: {
                fontSize: 16,
            },
            upperCaseLabel: false,
        }
    }
)

/**
 * A group tab/screen.
 * It has two screens: GroupScreen and GroupDetailScreen.
 * Clicking a specific group (gridView item) should navigate to that user's page.
 */
const GroupStack = createStackNavigator(
    {
        Group: {
            screen: GroupScreen,
        },
        GroupDetail: {
            screen: GroupDetailScreen,
        },
        CreateMessage: {
            screen: CreateMessageScreen,
        },
        CreateGroup: {
            screen: CreateGroupScreen,
        },
    },
    {
        initialRouteName: 'Group',
        headerMode: 'none',
        navigationOptions: {
            tabBarLabel: 'Fiafias',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="md-cube" color={tintColor} size={28} />
            )
        }
    }
)

/**
 * A profile tab/screen.
 * It has two screens: ProfileScreen and EditProfileScreen.
 * Clicking a settings icon should navigate to the EditProfileScreen.
 */
const ProfileStack = createStackNavigator(
    {
        Profile: {
            screen: ProfileScreen,
        },
        EditProfile: {
            screen: EditProfileScreen,
        }
    },
    {
        initialRouteName: 'Profile',
        headerMode: 'none',
    }
)

// Makes the top tab invisible when viewing the EditProfile page.
ProfileStack.navigationOptions = ({ navigation }) => {
    if(navigation.state.index==1){
        return {
            tabBarVisible: false,
        };
    }
    return {
        tabBarVisible: true,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="md-person" color={tintColor} size={28} />
        )
    };
};

/**
 * A bottom tab navigation bar.
 * This is the stack that encompasses all routes of the app.
 */
const AppStack = createMaterialTopTabNavigator(
    {
        Home: HomeStack,
        Search: SearchStack,
        Group: GroupStack,
        Friend: FriendStack,
        Profile: ProfileStack
    },
    {
        initialRouteName: 'Home',
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        tabBarOptions: {
            activeTintColor: '#1c313a',
            inactiveTintColor: 'grey',
            style: {
                backgroundColor: '#ffffff',
            },
            indicatorStyle: {
                height: 0
            },
            showLabel: false,
            showIcon: true
        }
    }
)

/**
 * A stack navigator for two authentication screens: Login and Register.
 */
const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
})

/**
 * A switch navigator that links the app, authentication, and splash.
 */
const AppStackNavigator = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading', // splash screen
    }
))
