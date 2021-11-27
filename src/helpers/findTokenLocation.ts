import Request from "../types/Request";

export default function findTokenLocation(req: Request, params: string){

    //check all possible places for token
    const token = req.header("x-auth-token")
     || req.header("x-access-token")
     || req.query.token
     || req.params.token
     || req.body.token
     || req.headers.token
     || req.headers.authorization
     || params;

     //console.log(token);
     if(token){
        return token;
     }else{
      return null;
        }

}