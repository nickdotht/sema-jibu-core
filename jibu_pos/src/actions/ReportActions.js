import PosStorage from "../database/PosStorage";

export const SALES_REPORT_FROM_ORDERS = 'SALES_REPORT_FROM_ORDERS';


export function GetSalesReportData( beginDate, endDate ) {
	console.log("GetSalesReportData - action");

	return (dispatch) => {
		getSalesData(beginDate, endDate)
			.then( salesData =>{
				dispatch({type: SALES_REPORT_FROM_ORDERS, data:{salesData:salesData}})
			})
			.catch((error) => {
				console.log( "GetSalesReportData - Error " + error.message);
				dispatch({type: SALES_REPORT_FROM_ORDERS, data:{salesData:[]}})
			});
		}

}

const getSalesData = (beginDate, endDate) =>{
	return new Promise((resolve, reject) => {
		let results = new Map();
		let sales = PosStorage.getFilteredSales(beginDate, endDate);
		let resolvedCount = 0;
		if( sales.length === 0 ){
			resolve({totalLiters: 0, totalSales: 0, salesItems:[]});
		}
		for( let index = 0; index < sales.length; index++ ){
			PosStorage.loadSale(sales[index] ).then( (receipt) => {
				resolvedCount++;
				receipt.products.every(product => {
					let mapProduct = results.get(product.sku);
					if (mapProduct) {
						mapProduct.quantity += product.quantity;
						mapProduct.totalSales += product.priceTotal;
						if (mapProduct.litersPerSku != "N/A"){
							mapProduct.totalLiters += mapProduct.litersPerSku * product.quantity;
						}
					}else{
						mapProduct = {
							sku: product.description,
							quantity: product.quantity,
							pricePerSku: product.priceTotal/product.quantity,
							totalSales: product.priceTotal,
							litersPerSku:product.litersPerSku
						};
						if( mapProduct.litersPerSku != "N/A" ) {
							mapProduct.totalLiters = mapProduct.litersPerSku * product.quantity;
						}
						results.set(product.sku, mapProduct);
					}
					return true;
				});
				if( (resolvedCount) === sales.length){
					let salesItems = [];
					let totalLiters = 0;
					let totalSales = 0;
					results.forEach(value => {
						if( value.litersPerSku != "N/A"){
							totalLiters += value.totalLiters;
						}
						totalSales += value.totalSales;
						salesItems.push(value);
					});
					if( totalLiters === 0 ){
						totalLiters = "N/A";
					}
					resolve({totalLiters: totalLiters, totalSales: totalSales, salesItems:salesItems});

				}
			});
		}
	});
};
