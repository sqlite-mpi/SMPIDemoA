import React from 'react';
import {ScrollView, Text, View, Button} from 'react-native';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {coreStore} from './../../stores/core';

import {Txt, H1} from './../../components/base';


import {TestFrame} from '../TestFrame';


@observer
class Tbl extends React.Component {
    render() {
        const {
            data,
        } = this.props;

        const k = [
            'complete',
            'active',
            'queued',
            'ops',
            'lastWid',
        ];

        return <View>

            <View>
                {k.map((k, i) => {
                    const v = k === "lastWid" ?
                        JSON.stringify(data[k]).replace(/,/g, ",\n").replace(/[\[\]]/g, "") :
                        data[k];

                    return <View key={i}>
                        <Text>{k}</Text>
                        <Text>{v}</Text>
                        <Text></Text>
                    </View>;
                })}

            </View>

        </View>;
    }
}


@observer
class RWCount extends React.Component {
    render() {
        if (coreStore.tests.rwCount === null) {
            return null;
        }

        const {read, write} = coreStore.tests.rwCount;

        return <TestFrame>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-around"}}>
                <View>
                    <H1>Write</H1>
                    <Tbl data={write} />
                </View>

                <View>
                    <H1>Read</H1>
                    <Tbl data={read} />
                </View>
            </View>

        </TestFrame>;
    }
}


export {
    RWCount,
};
