import { Document, Model, model, Schema } from "mongoose";
import accessTypes from './config';
/**
 * user type interface to model the user type
 * @param accessRights:string
 */
export interface IUserType extends Document {
    accessRights: string;
}

const UserTypeSchema: Schema = new Schema({
    accessRights: {
        type: String, //default: 'user',
        default: accessTypes.user,
    }
});

const UserType = model<IUserType>('UserType', UserTypeSchema);

export default UserType;