export interface IUserType {
    admin?: string,
    user?: string,
    mod?: string,
    banned?: string,
}

const userTypes: IUserType = {
    admin: 'admin',
    user: 'user',
    mod: 'mod',
    banned: 'banned',
}

export default userTypes;