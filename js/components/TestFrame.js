import React from 'react';
import {ScrollView, Text, View, Button} from 'react-native';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {coreStore} from './../stores/core';

import {Txt, H1} from './../components/base';


class TestFrame extends React.Component {
    render() {
        const {curTestKey = null} = coreStore;

        return <View>
            <View>
                <Button title={`Back`} onPress={()=>{
                    coreStore.stopAndGoToMenu();
                }} />
            </View>
            <View>
                {this.props.children}
            </View>
        </View>;
    }

}

export {
    TestFrame
}
