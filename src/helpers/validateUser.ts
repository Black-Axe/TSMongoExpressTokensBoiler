import mongoose from 'mongoose';
import User, { IUser } from '../models/User/User';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

export interface IValidationObject {
    isValidId?: boolean;
    isValidUser?: boolean;
    message: string;
    user?: IUser; 
    token?: string;
}

// helper method to validate if the Id is valid mongoose Id
export const validateId = (id: string): IValidationObject => {
    const validationObject: IValidationObject = {
        isValidId: false,
        isValidUser: false,
        message: '',
    };
    if(!id){
        validationObject.message = 'Id is required';
        return validationObject;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        validationObject.message = 'Invalid Id';
        return validationObject;
    }

    validationObject.isValidId = true;
    return validationObject;
};

export const getUserById = async (id: string): Promise<IValidationObject> => {
    const validationObject: IValidationObject = validateId(id);
    if (!validationObject.isValidId) {
        return validationObject;
    }
    try {
        const user: IUser = await User.findById(id);
        if (!user) {
            validationObject.message = 'User not found';
            return validationObject;
        }
        validationObject.user = user;
        validationObject.isValidUser = true;
        validationObject.message = 'User exists';
        return validationObject;
    } catch (error) {
        validationObject.message = error.message;
        return validationObject;
    }
}

export const getUserByEmail = async (email: string): Promise<IValidationObject> => {
    const validationObject: IValidationObject = {
        isValidId: false,
        isValidUser: false,
        message: '',
    };
    if(!email){
        validationObject.message = 'Email is required';
        return validationObject;
    }
    try {
        const user: IUser = await User.findOne({ email });
        if (!user) {
            validationObject.message = 'User not found';
            return validationObject;
        }
        validationObject.user = user;
        validationObject.isValidUser = true;
        //getToken
        let token: string = getToken(user);
        validationObject.message = 'User exists';
        validationObject.token = token;
        return validationObject;
    } catch (error) {
        validationObject.message = error.message;
        return validationObject;
    }
}

export const getToken = (user: IUser): string => {
    const payload = {
        user: {
            id: user.id
        }
    }
    return jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
            expiresIn: config.get("jwtExpiration")
        },
    );
}
