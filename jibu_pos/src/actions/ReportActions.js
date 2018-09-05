import PosStorage from "../database/PosStorage";
import { REMOVE_PRODUCT } from "./OrderActions";

export const SALES_REPORT_FROM_ORDERS = 'SALES_REPORT_FROM_ORDERS';
export const INVENTORY_REPORT = 'INVENTORY_REPORT';
export const REPORT_TYPE = 'REPORT_TYPE';


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

export function setReportType( reportType ) {
	console.log("setReportType - action");
	return (dispatch) => { dispatch({type: REPORT_TYPE, data:reportType}); }
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
					// salesItems = salesItems.concat(salesItems);
					// salesItems = salesItems.concat(salesItems);
					resolve({totalLiters: totalLiters, totalSales: totalSales, salesItems:salesItems});

				}
			});
		}
	});
};

export function GetInventoryReportData( beginDate, endDate, products ) {
	console.log("GetInventoryReportData - action");

	return (dispatch) => {
		getInventoryData(beginDate, endDate, products)
			.then( inventoryData =>{
				dispatch({type: INVENTORY_REPORT, data:{inventoryData:inventoryData}})
			})
			.catch((error) => {
				console.log( "GetInventoryReportData - Error " + error.message);
				dispatch({type: INVENTORY_REPORT, data:{inventoryData:[]}})
			});
	}

}

const getInventoryData = (beginDate, endDate, products) =>{
	return new Promise((resolve, reject) => {
		let inventory = {currentMeter:110, currentProductSkus:[], previousMeter:120, previousProductSkus:[]};
		inventory.currentProductSkus = products.map( product =>{ return {sku:product.sku, inventory:null }});
		inventory.previousProductSkus = products.map( product =>{ return {sku:product.sku, inventory:null }});
		resolve(inventory);
	});
};
