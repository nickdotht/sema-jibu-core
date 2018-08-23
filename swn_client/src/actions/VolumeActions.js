import * as allActions from './ActionTypes';
import { axiosService } from 'services';

function receiveVolume(data) {
	console.log("receiveVolume - ", data.toString());
	data = updateVolume(data);
	return {type: allActions.RECEIVE_VOLUME, data};
}

function initializeVolume() {
	return {
		volumeInfo: {
			volumeByChannel:{},
			volumeByChannelAndIncome:[],
			volumeByChannelAndType:[]
		}
	}
}


function fetchVolume(params) {
	return (dispatch) => {
		return fetchVolumeData(params)
			.then(volumeInfo => {
				dispatch(receiveVolume(volumeInfo));
			});
	};
}



const fetchVolumeData = ( params) => {
	return new Promise (async(resolve, reject ) => {
		let result = initializeVolume();
		try {
			result.volumeInfo.volumeByChannel = await fetchVolumeItem(params, "sales-channel", {});
			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {incomeGT: 8}));
			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {
				incomeLT: 8,
				incomeGT: 5
			}));
			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {
				incomeLT: 5,
				incomeGT: 2
			}));
			result.volumeInfo.volumeByChannelAndIncome.push(await fetchVolumeItem(params, "sales-channel", {incomeLT: 2}));

			let types = await fetchCustomerTypes();
			if (types) {
				for (let index = 0; index < types.customerTypes.length; index++) {
					const volumeInfo = await fetchVolumeItem(params, "sales-channel", {customerType: types.customerTypes[index].id});
					volumeInfo.customerTypeName = types.customerTypes[index].name;
					result.volumeInfo.volumeByChannelAndType.push(volumeInfo);
				}
			}
			resolve(result);
		}catch( error ){
			console.log("fetchVolumeData - Failed ");
			resolve(result);

		}
	});
}


function fetchVolumeItem( params, type, options ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/receipt-summary?site-id=' + params.kioskID + "&type=" +type;
		if(options.hasOwnProperty("incomeLT") ){
			url = url + "&income-lt=" + options.incomeLT;
		}
		if(options.hasOwnProperty("incomeGT") ){
			url = url + "&income-gt=" + options.incomeGT;
		}

		if(options.hasOwnProperty("customerType") ){
			url = url + "&customer-type=" + options.customerType;
		}
		axiosService
			.get(url)
			.then(response => {
				if(response.status === 200){
					resolve(response.data)
				}else{
					reject(initializeVolume())
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}

function fetchCustomerTypes(  ) {
	return new Promise((resolve, reject ) => {
		axiosService
			.get('/sema/customer-types')
			.then(response => {
				if(response.status === 200){
					resolve(response.data)
				}else{
					reject(null)
				}
			})
			.catch(function(error){
				reject(error)
			});
	});
}

const updateVolume = volumeData => {
	return {
		loaded:true,
		volume: volumeData
	}
};



export const volumeActions = {
	receiveVolume,
	initializeVolume,
	fetchVolume
};
