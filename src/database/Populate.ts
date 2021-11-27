//populate the db with the user types

import  UserType  from "../models/UserType/UserType";
import userTypes from "../models/UserType/config";

class DBPopulate {
    public static async populate() {

        console.log("Populating the database with user types");
        // check if the user type exists first
        let populated = await isPopulated();
        if (populated) {
            console.log("UserTypes already populated not repopulating");
            return;
        }

        const userType = new UserType({
            accessRights: userTypes.admin,
        });
        await userType.save();

        const userType2 = new UserType({
            accessRights: userTypes.user,
        });
        await userType2.save();

        const userType3 = new UserType({
            accessRights: userTypes.mod,
        });
        await userType3.save();

        const userType4 = new UserType({
            accessRights: userTypes.banned,
        });
        await userType4.save();

        console.log("UserType populated");
    }

}

// helper to check if userTypes are already populated
export const isPopulated = async () => {
    const userTypes = await UserType.find();
    return userTypes.length > 0;
}


export default DBPopulate;