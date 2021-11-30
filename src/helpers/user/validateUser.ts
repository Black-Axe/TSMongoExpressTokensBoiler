import mongoose from 'mongoose';
import User, { IUser } from '../../models/User/User';

import config from "config";

export interface IValidator {
    isValidId?: boolean;
    isValidUser?: boolean;
    message: string;
    user?: IUser; 
}

// helper method to validate if the Id is valid mongoose Id
export const validateId = (id: string): IValidator => {
    const validator: IValidator = {
        isValidId: false,
        isValidUser: false,
        message: '',
    };
    if(!id){
        validator.message = 'Id is required';
        return validator;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        validator.message = 'Invalid Id';
        return validator;
    }

    validator.isValidId = true;
    return validator;
};

export const getUserById = async (id: string): Promise<IValidator> => {
    const validator: IValidator = validateId(id);
    if (!validator.isValidId) {
        return validator;
    }
    try {
        const user: IUser = await User.findById(id);
        if (!user) {
            validator.message = 'User not found';
            return validator;
        }
        validator.user = user;
        validator.isValidUser = true;
        validator.message = 'User exists';
        return validator;
    } catch (error) {
        validator.message = error.message;
        return validator;
    }
}

export const getUserByEmail = async (email: string): Promise<IValidator> => {
    const validator: IValidator = {
        isValidId: false,
        isValidUser: false,
        message: '',
    };
    if(!email){
        validator.message = 'Email is required';
        return validator;
    }
    try {
        const user: IUser = await User.findOne({ email });
        if (!user) {
            validator.message = 'User not found';
            return validator;
        }
        validator.user = user;
        validator.isValidUser = true;
        validator.message = 'User exists';
        return validator;
    } catch (error) {
        validator.message = error.message;
        return validator;
    }
}


