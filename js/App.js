/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar, Button,
} from 'react-native';

import {coreStore} from './stores/core';

import {Menu} from './components/Menu';
import {RWCount} from './components/tests/RWCount';
import {observer} from 'mobx-react';

const getCurrentTest = (key) => {
    switch (key) {
        case 'rwCount':
            return <RWCount />;
            break;

    }
    return null;
};



@observer
class App extends React.Component {


    render() {
        const {curTestKey = null} = coreStore;



        return <>
            <StatusBar barStyle="dark-content"/>

            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={{padding: 10}}
                >
                    {curTestKey === null ? <Menu/> : getCurrentTest(curTestKey)}
                </ScrollView>
            </SafeAreaView>
        </>;
    }
}


export default App;
