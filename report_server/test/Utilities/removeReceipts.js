let sqlDeleteAllReciptLineItems = "TRUNCATE TABLE receipt_line_item";
let sqlDeleteALLReceipts = "TRUNCATE TABLE receipt";

const removeReceipts = (query, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('delete all receipts - failed');
					resolve(false);
				}
				else {
					semaLog.info('delete all receipts - succeeded');
					resolve(true);
				}
			});

		})
	});
};

const removeReceiptLineItems = (query, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('delete all receipt line items - failed');
					resolve(false);
				}
				else {
					semaLog.info('delete all receipt line items - succeeded');
					resolve(true);
				}
			});

		})
	});
};

module.exports = {removeReceipts, removeReceiptLineItems};
