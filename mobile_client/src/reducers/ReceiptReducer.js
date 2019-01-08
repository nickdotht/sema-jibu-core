
import {
    SET_REMOTE_RECEIPTS,
    ADD_LOCAL_RECEIPT,
    SET_LOCAL_RECEIPTS,
    UPDATE_REMOTE_RECEIPT,
    UPDATE_LOCAL_RECEIPT,
    UPDATE_RECEIPT_LINE_ITEM
} from "../actions/ReceiptActions";

let initialState = {
    localReceipts: [],
    remoteReceipts: [],
    updatedRemoteReceipts: []
};

const receiptReducer = (state = initialState, action) => {
    console.log("receiptReducer: " + action.type, action.data);

    let newState;

    switch (action.type) {
        case SET_REMOTE_RECEIPTS:
            let { remoteReceipts } = action.data;
            newState = { ...state };
            newState.remoteReceipts = remoteReceipts;
            return newState;
        case ADD_LOCAL_RECEIPT:
            let { receipt } = action.data;
            receipt.isLocal = true;
            newState = { ...state };
            newState.localReceipts.length ?
                newState.localReceipts.push(receipt) :
                newState.localReceipts = [receipt];
            return newState;
        case SET_LOCAL_RECEIPTS:
            let { localReceipts } = action.data;
            newState = { ...state };
            newState.localReceipts = localReceipts;
            return newState;
        case UPDATE_REMOTE_RECEIPT:
            let {
                remoteReceiptIndex,
                updatedRemoteFields
            } = action.data;
            newState = { ...state };
            newState.remoteReceipts[remoteReceiptIndex] = { ...newState.remoteReceipts[remoteReceiptIndex], ...updatedRemoteFields };
            newState.remoteReceipts[remoteReceiptIndex].receipt_line_items = newState.remoteReceipts[remoteReceiptIndex].receipt_line_items.map(item => {
                item.active = updatedRemoteFields.active;
                return item;
            });
            return newState;
        case UPDATE_RECEIPT_LINE_ITEM:
            let {
                receiptIndex,
                lineItemIndex,
                updatedLineItemFields
            } = action.data;
            newState = { ...state };
            newState.remoteReceipts[receiptIndex] = { ...newState.remoteReceipts[receiptIndex], updated: true, updatedLineItem: true};
            newState.remoteReceipts[receiptIndex].receipt_line_items[lineItemIndex] = { ...newState.remoteReceipts[receiptIndex].receipt_line_items[lineItemIndex], ...updatedLineItemFields};
            return newState;
        case UPDATE_LOCAL_RECEIPT:
            let {
                localReceiptIndex,
                updatedLocalFields
            } = action.data;
            newState = { ...state };
            newState.localReceipts[localReceiptIndex] = { ...newState.localReceipts[localReceiptIndex], ...updatedLocalFields };
            return newState;
        default:
            return state;
    }
};

export default receiptReducer;


