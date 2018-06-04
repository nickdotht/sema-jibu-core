import React, {Component} from "react";
import {
    StyleSheet,
    ToolbarAndroid
} from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as CustomerActions from "../actions/CustomerActions";
import networkReducer from "../reducers/NetworkReducer";

class Toolbar extends Component {
    render() {
        return (
            <ToolbarAndroid
                style = {styles.toolbar}
                logo={require('../images/dlo_image.png')}
                title="Fred was here all day"
				titleColor='white'
				subtitle ={this.getNetworkMessage()}
				subtitleColor='white'
                actions={[{title: 'Settings', icon: require('../images/settings.png'), show: 'always'}]}
                onActionSelected={this.onActionSelected} />
        );
    }
    onActionSelected = () =>{
        console.log("foo");
    }

    getNetworkMessage = () =>{
    	if( this.props.isNWConnected ){
    		return "Connected!"
		}else{
			return "Not Connected!"
		}
	}

}

function mapStateToProps(state, props) {
	return {
		isNWConnected: state.networkReducer.isNWConnected
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(CustomerActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#2858a7',
        height: 56,
        alignSelf: 'stretch',

    },
});
