import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as reportActions from "../../actions/ReportActions";
import { Table, Row } from 'react-native-table-component';

import i18n from '../../app/i18n';

class SalesLogging extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableHead: ['Date', 'Name', 'SKU', 'Quantity', 'Cost', 'Action']
        }
    }

    componentDidMount() {
        console.log("SalesLogging - componentDidMount");
    }

    render() {
        if (this.props.reportType === "salesLogging") {
            return (
                <View style={styles.table_container}>
                    <Table borderStyle={{ borderWidth: 0 }}>
                        <Row data={this.state.tableHead} style={styles.table_header} textStyle={styles.table_header_text} />
                    </Table>
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
    table_container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    table_header: {
        height: 40,
        backgroundColor: '#ABC1DE'
    },

    table_header_text: {
        fontWeight: 'bold',
        alignSelf: 'center'
    },
});
