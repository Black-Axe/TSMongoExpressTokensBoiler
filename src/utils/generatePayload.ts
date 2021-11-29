import {IUser} from "../models/User/User";

interface IPayload {
    user: {
        _id: string;
    };
}

export const generatePayload = (user: IUser): IPayload => {
    let payload: IPayload = {
        user: {
            _id: user._id,
        },
    };
    return payload;
}