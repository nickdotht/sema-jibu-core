import jwt from 'jsonwebtoken';
import { axiosService } from 'services';


const getBackgroundColorForChannel = channelName => {
	switch( channelName.toLowerCase() ){
		case "household":
			return "rgba(95,161,55,1.0)";
		case "main station":
			return "rgba(75,135,201,1.0)";
		case "access points":
			return "rgba(253,181,10,1.0)";

		default:
			return "rgba(255,0,0,1)";



	}
};

export const utilService = {
	getBackgroundColorForChannel
};
