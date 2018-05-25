import React, {Component} from "react";
import {
    StyleSheet,
    ToolbarAndroid
} from 'react-native';

export default class Toolbar extends Component {
    render() {
        return (
            <ToolbarAndroid
                style = {styles.toolbar}
                logo={require('../images/dlo_image.png')}
                title="Fred was here all day"
                actions={[{title: 'Settings', icon: require('../images/settings.png'), show: 'always'}]}
                onActionSelected={this.onActionSelected} />
        );
    }
    onActionSelected = () =>{
        console.log("foo");
    }
}
const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#2858a7',
        height: 56,
        alignSelf: 'stretch',

    },
});
