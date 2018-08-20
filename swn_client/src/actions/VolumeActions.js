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
		loaded:false,
		volumeBySalesChannel: { beginDate:"N/A", endDate: "N/A", data: []}
	}
}

function fetchVolume( params ) {
	return (dispatch) => {
		let url = '/sema/dashboard/site/receipt-summary?site-id=' + params.siteId;
		return axiosService
			.get(url)
			.then(response => {
				if(response.status === 200){
					dispatch(receiveVolume(response.data))
				}else{
					dispatch(receiveVolume(initializeVolume()))

				}
			})
			.catch(function(){
				// This means the service isn't running.
				dispatch(receiveVolume(initializeVolume()))
			});
	};
}


const updateVolume = volume => {
	return {
		loaded:true,
		volumeBySalesChannel: volume
	}
};



export const volumeActions = {
	receiveVolume,
	initializeVolume,
	fetchVolume
};
