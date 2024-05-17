import crypto from "crypto";
import { NextRequest } from "next/server";
import { env } from "~/env";

export default async function POST(req: NextRequest){
  var secret = env.CHAPA_SECRET;
    const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers.get('Chapa-Signature')) {
    // Retrieve the request's body
    const event = req.body;

    console.log(event);
    
    // Do something with e
    }    
  return new Response(null, {status: 200});
}
