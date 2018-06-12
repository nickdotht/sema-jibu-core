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
						mapProduct.totalLiters = (mapProduct.litersPerSku == "N/A") ? "N/A" : mapProduct.litersPerSku * mapProduct.quantity;
					} else {
						mapProduct = {
							sku: product.description,
							quantity: product.quantity,
							pricePerSku: product.price_amount,
							totalSales: product.quantity * product.price_amount,
						};
						mapProduct.litersPerSku = (product.liters_per_sku ) ? product.liters_per_sku : "N/A";
						mapProduct.totalLiters = (mapProduct.litersPerSku == "N/A") ? "N/A" : mapProduct.litersPerSku * mapProduct.quantity;
						results.set(product.sku, mapProduct);
					}
					return true;
				});
				if( (resolvedCount) === sales.length){
					let salesItems = [];
					let totalLiters = "N/A";
					let totalSales = 0;
					results.forEach(value => {
						if( value.totalLiters != "N/A"){
							if( totalLiters == "N/A"){
								totalLiters = value.totalLiters;
							}else{
								totalLiters += value.totalLiters;
							}
						}
						totalSales += value.totalSales;
						salesItems.push(value);
					});
					resolve({totalLiters: totalLiters, totalSales: totalSales, salesItems:salesItems});

				}
			});
		}
	});
};
