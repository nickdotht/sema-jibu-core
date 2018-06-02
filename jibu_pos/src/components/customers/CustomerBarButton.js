import React from "react";
import { View, Button, StyleSheet} from 'react-native';
// import { withNavigation } from 'react-navigation';

class CustomerBarButton extends React.Component {
	render() {
		return (
			<View style={styles.Button}>
				<Button
					onPress={this.props.handler}
					title={this.props.title}
					color='#2858a7'
					disabled = {!this.props.enabled}
				/>
			</View>
		);
	}
}
// export default CustomerBarButton
export default CustomerBarButton;
const styles = StyleSheet.create({

	Button: {
		flex: .1,
		// alignSelf:'center',
		// height:70,
		marginLeft:15
	},
});

