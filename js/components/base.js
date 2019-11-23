import {observer} from 'mobx-react';
import React from 'react';
import {Button, Text, View} from 'react-native';


// Enable setting global font styles.
@observer
class Txt extends React.Component {


    render() {


        return <Text>{this.props.children}</Text>;
    }
}


@observer
class H1 extends React.Component {
    render() {
        const s = {
            fontSize: 32,
        };
        return <Text style={s}>{this.props.children}</Text>;
    }
}


export {
    H1,
    Txt,
};
