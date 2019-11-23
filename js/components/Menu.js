import React from 'react';
import {ScrollView, Text, View, Button} from 'react-native';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {coreStore} from '../stores/core';

import {Txt, H1} from './base';

@observer
class One extends React.Component {


    render() {
        const {testKey, title, desc} = this.props;

        return <View style={{marginTop: 20, marginBottom: 20}}>
            <Button
                title={title}
                onPress={() => coreStore.startTest(testKey)}
            />

            <Text>{desc}</Text>

        </View>;
    }
}

@observer
class Menu extends React.Component {
    render() {
        return <View>
            <H1>SQLite MPI tests.</H1>


            <One
                testKey={'rwCount'}
                title={`1. Read and write transactions.`}
                desc={`This test randomly starts concurrent read and write transactions to test: \n\n- Read txs are concurrent (many active at a time). \n- Write txs queue, with one active at any time. \n- Isolation between txs.`}
            />

        </View>;
    }
}

export {
    Menu,
};
