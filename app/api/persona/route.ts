import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST (request: NextRequest){
  try {
    const rawBody = await request.text();
    const data = JSON.parse(rawBody).data.attributes;
    const signature = request.headers.get("persona-signature") as string;

    const reqBody = {
      signature,
      userId: Number(data.payload.data.attributes['reference-id']),
      event: data.name,
      rawBody: rawBody,
    };

    const headers = {
      'Content-Type': 'application/json',
      api_key: process.env.FRONTEND_API_KEY,
    };

    const response = await axios.post(`${process.env.SERVER_URL}/services/persona`, reqBody, { headers });

    const resData = response.data;

    if (resData?.data && resData?.data?.statusCode >= 400) {
      throw new Error(resData.data.message);
    }

    return NextResponse.json({}, {
      status: 200,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error },
      {
        status: 500,
      }
    );
  }
}



