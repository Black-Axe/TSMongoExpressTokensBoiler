import Request from "../types/Request";

export default function findTokenLocation(req: Request, params: string){
    console.log(req.query);
    console.log(req.params);
    const token = req.header("x-auth-token") || req.header("x-access-token") || req.query.token || req.params.token || req.body.token || req.headers.token || req.headers.authorization;

    console.log(token);

    console.log(req.headers);
    console.log(req.headers.authorization);
    console.log(req.header("authorization"));
    console.log(token);
}