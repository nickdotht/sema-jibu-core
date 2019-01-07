import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as reportActions from "../../actions/ReportActions";
import * as receiptActions from "../../actions/ReceiptActions";

import i18n from '../../app/i18n';
import moment from 'moment';
import PosStorage from '../../database/PosStorage';

class ReceiptLineItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', marginBottom: 10, marginTop: 10}}
                onPress={this.onDeleteReceiptLineItem(this.props.receiptIndex, this.props.item)}
            >
                <Image
                    source={{ uri: this.getImage(this.props.item.product) }}
                    style={{ width: 50, height: 50, marginRight: 5, marginLeft: 20 }}>
                </Image>
                <View>
                    <Text style={{color: this.props.item.active ? 'green' : 'red'}}>{this.props.item.active ? 'ACTIVE' : 'INACTIVE'}</Text>
                    <Text>Product SKU: {this.props.item.product.sku}</Text>
                    <Text>Quantity: {this.props.item.quantity}</Text>
                    <Text>Cost: {this.props.item.price_total}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    onDeleteReceiptLineItem(receiptIndex, item) {
        return () => {
            Alert.alert(
                'Confirm Receipt Line Item Deletion',
                'Are you sure you want to delete this receipt line item? (this cannot be undone)',
                [
                    { text: i18n.t('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: i18n.t('yes'), onPress: () => {
                            this.deleteReceiptLineItem(receiptIndex, this.props.lineItemIndex, {active: false, updated: true});
                        }
                    },
                ],
                { cancelable: true }
            );
        }
    }

    // deleteReceipt(item, updatedFields) {
    //     if (!item.isLocal) {
    //         this.props.receiptActions.updateRemoteReceipt(item.index, updatedFields);
    //         PosStorage.saveRemoteReceipts(this.props.remoteReceipts);
    //     } else {
    //         // this.props.receiptActions.updateLocalReceipt(item, updatedFields);            
    //     }
	// 	this.setState({refresh: !this.state.refresh});
    // }

    deleteReceiptLineItem(receiptIndex, receiptLineItemIndex, updatedFields) {
        this.props.receiptActions.updateReceiptLineItem(receiptIndex, receiptLineItemIndex, updatedFields);
        PosStorage.saveRemoteReceipts(this.props.remoteReceipts);
        this.props.handleUpdate();
    }

    getImage = item => {
        if (item.base64encoded_image.startsWith('data:image')) {
            return item.base64encoded_image;
        } else {
            return 'data:image/png;base64,' + item.base64encoded_image
        }
    }
}

class SalesLog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refresh: false
        }
    }

    componentDidMount() {
        console.log("SalesLog - componentDidMount");
        PosStorage.loadRemoteReceipts()
            .then(receipts => {
                this.props.receiptActions.setRemoteReceipts(receipts);
            });
    }

    render() {
        if (this.props.reportType === "salesLog") {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={this.prepareData()}
                        renderItem={this.renderReceipt.bind(this)}
                        keyExtractor={(item, index) => item.id}
                        ItemSeparatorComponent={this.renderSeparator}
                        extraData={this.state.refresh}
                    />
                </View>
            );
        }

        return null;
    }

    handleUpdate() {
        this.setState({
            refresh: !this.state.refresh
        });
    }

    renderSeparator() {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: '#ddd',
                    width: '100%'
                }}
            >
            </View>
        )
    }

    renderReceipt({ item, index }) {
        const receiptLineItems = item.receiptLineItems.map((lineItem, idx) => {
            return <ReceiptLineItem
                receiptActions={this.props.receiptActions}
                remoteReceipts={this.props.remoteReceipts}
                item={lineItem}
                key={lineItem.id}
                lineItemIndex={idx}
                handleUpdate={this.handleUpdate.bind(this)}
                receiptIndex={item.index}></ReceiptLineItem>
        });

        return (
            <TouchableOpacity
                key={index}
                onPress={this.onDeleteReceipt(item)}
                style={{padding: 15}}
            >
                <Text>Receipt Id: {item.id}</Text>
                <Text style={{color: item.active ? 'green' : 'red'}}>{item.active ? 'ACTIVE' : 'INACTIVE'}</Text>
                <Text>Date Created: {moment.utc(item.createdAt).format('YYYY-MM-DD hh:mm:ss')}</Text>
                <Text>Customer Name: {item.customerAccount.name}</Text>
                {receiptLineItems}
            </TouchableOpacity>
        );
    }

    onDeleteReceipt(item) {
        return () => {
            Alert.alert(
                'Confirm Receipt Deletion',
                'Are you sure you want to delete this receipt? (this cannot be undone)',
                [
                    { text: i18n.t('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: i18n.t('yes'), onPress: () => {
                            this.deleteReceipt(item, { active: 0, updated: true});
                        }
                    },
                ],
                { cancelable: true }
            );
        }
    }

    deleteReceipt(item, updatedFields) {
        if (!item.isLocal) {
            this.props.receiptActions.updateRemoteReceipt(item.index, updatedFields);
            PosStorage.saveRemoteReceipts(this.props.remoteReceipts);
        } else {
            // this.props.receiptActions.updateLocalReceipt(item, updatedFields);            
        }
		this.setState({refresh: !this.state.refresh});
    }

    prepareData() {
        let remoteReceipts = this.props.remoteReceipts.map((receipt, index) => {
            return {
                active: receipt.active,
                id: receipt.id,
                createdAt: receipt.created_at,
                customerAccount: receipt.customer_account,
                receiptLineItems: receipt.receipt_line_items,
                isLocal: false,
                index
            };
        });

        // let localReceipts = this.props.localReceipts.map((receipt, index) => {
        //     return {
        //         active: receipt.sale.active,
        //         id: receipt.key,
        //         createdAt: receipt.sale.createdDate,
        //         customerAccount: this.getCustomer(receipt.sale.customerId),
        //         receiptLineItems: this.getProducts(receipt.sale.products),
        //         isLocal: true,
        //         index
        //     };
        // });

        return [...remoteReceipts];
    }

    getCustomer(customerId) {
        return this.props.customers.filter(customer =>
            customer.customerId === customerId
        )[0];
    }

    getProducts(products) {
        return products.map(product => {
            product.product = this.getProduct(product.productId);
            product.product.base64encoded_image = product.product.base64encodedImage
            product.active = product.product.active;
            return product;
        })
    }

    getProduct(productId) {
        return this.props.products.filter(product => {
            return product.productId === productId
        })[0];
    }
}

function mapStateToProps(state, props) {
    return {
        reportType: state.reportReducer.reportType,
        localReceipts: state.receiptReducer.localReceipts,
        remoteReceipts: state.receiptReducer.remoteReceipts,
        customers: state.customerReducer.customers,
        products: state.productReducer.products
    };
}

function mapDispatchToProps(dispatch) {
    return {
        reportActions: bindActionCreators(reportActions, dispatch),
        receiptActions: bindActionCreators(receiptActions, dispatch)
    };
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SalesLog);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
