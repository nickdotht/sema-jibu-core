import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as reportActions from "../../actions/ReportActions";

import i18n from '../../app/i18n';

class SalesLogging extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("SalesLogging - componentDidMount");
    }

    render() {
        if (this.props.reportType === "salesLogging") {
            return (
                <View style={{ flex: 1 }}>
                    <Text>Hello</Text>
                </View>
            );
        }

        return null;
    }
}

function mapStateToProps(state, props) {
    return {
        reportType: state.reportReducer.reportType
    };
}

function mapDispatchToProps(dispatch) {
    return { reportActions: bindActionCreators(reportActions, dispatch) };
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SalesLogging);

const styles = StyleSheet.create({
});
