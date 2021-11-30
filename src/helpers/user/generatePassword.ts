
import bcrypt from "bcryptjs";

export async function generateHashedPass(pass:string){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
}