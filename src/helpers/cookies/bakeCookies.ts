import IGrandToken from 'IGrandToken';
import config from '../../../config/defaults';
import {Response} from "express";
import {convertJwtTime} from "../../services/TokenService";

const accessCookie = config.accessCookie;
const refreshCookie = config.refreshCookie;


export async function bakeCookies(res: Response, grandToken:IGrandToken){
let accessTokenExpiration = new Date(grandToken.accessTokenExpiration);
let refreshTokenExpiration = new Date(grandToken.refreshTokenExpiration);


//set the cookies for the user for their tokens
res.cookie(accessCookie, grandToken.accessToken, {
    httpOnly: true,
    expires: accessTokenExpiration,
    maxAge: expiration(accessTokenExpiration)
});
res.cookie(refreshCookie, grandToken.refreshToken, {
    httpOnly: true,
    expires: refreshTokenExpiration,
    maxAge: expiration(refreshTokenExpiration)
});
 

}

function expiration(expirationDate: Date): number{
    let expiration = expirationDate.getTime() - Date.now();
    //console.log(expiration, "expiration");
    //console.log("milliseconds", (expiration));
    //add milliseconds to current time
    //let currentTime = new Date();
    //let futureTime = currentTime.setMilliseconds(expiration);
    //console.log(futureTime, "future time");
    //console.log("converted", new Date(futureTime).toLocaleString());
     
    //console.log("future", (Date.now()+expiration).toLocaleString());
    
    //subtract datetime from now and then convert that time to milliseconds
    return expiration; 
}
