import PosStorage from "../database/PosStorage";

export const SALES_REPORT_FROM_ORDERS = 'SALES_REPORT_FROM_ORDERS';


export function GetSalesReportData( ) {
	console.log("GetSalesReportData - action");

	return (dispatch) => {
		getSalesData()
			.then( salesData =>{
				dispatch({type: SALES_REPORT_FROM_ORDERS, data:{salesData:salesData}})
			})
			.catch((error) => {
				console.log( "GetSalesReportData - Error " + error.message);
				dispatch({type: SALES_REPORT_FROM_ORDERS, data:{salesData:[]}})
			});
		}

}

const getSalesData = () =>{
	return new Promise((resolve, reject) => {
		let results = new Map();
		let sales = PosStorage.GetSales();
		let resolvedCount = 0;
		for( let index = 0; index < sales.length; index++ ){
			PosStorage.LoadSale(sales[index] ).then( (sale) => {
				resolvedCount++;
				sale.products.every(product => {
					let mapProduct = results.get(product.sku);
					if (mapProduct) {
						mapProduct.quantity += product.quantity;
						mapProduct.totalSales += product.quantity * product.price_amount;
					} else {
						mapProduct = {
							sku: product.description,
							quantity: product.quantity,
							pricePerSku: product.price_amount,
							totalSales: product.quantity * product.price_amount,
							litersPerSku: 'N/A',
							totalLiters: 'N/A',
						};
						results.set(product.sku, mapProduct);
					}
				});
				if( (resolvedCount) === sales.length){
					let salesItems = [];
					results.forEach(value => {
						salesItems.push(value);
					});
					resolve(salesItems);

				}
			});
		}
	});
};
