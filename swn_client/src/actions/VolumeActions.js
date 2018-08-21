import * as allActions from './ActionTypes';
import moment from "moment/moment";
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
			volumeByChannelAndIncome:[]
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
		result.volumeInfo.volumeByChannel = await fetchVolumeItem(params, "sales-channel", {});
		result.volumeInfo.volumeByChannelAndIncome.push( await fetchVolumeItem(params, "sales-channel", {incomeGT:8 }));
		result.volumeInfo.volumeByChannelAndIncome.push( await fetchVolumeItem(params, "sales-channel", {incomeLT:8,incomeGT:5 }));
		result.volumeInfo.volumeByChannelAndIncome.push( await fetchVolumeItem(params, "sales-channel", {incomeLT:5,incomeGT:2 }));
		result.volumeInfo.volumeByChannelAndIncome.push( await fetchVolumeItem(params, "sales-channel", {incomeLT:2}));
		resolve(result);
	});
}


function fetchVolumeItem( params, type, options ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/receipt-summary?site-id=' + params.siteId + "&type=" +type;
		if(options.hasOwnProperty("incomeLT") ){
			url = url + "&income-lt=" + options.incomeLT;
		}
		if(options.hasOwnProperty("incomeGT") ){
			url = url + "&income-gt=" + options.incomeGT;
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
			.catch(function(){
				// This means the service isn't running.
				reject(initializeVolume())
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
