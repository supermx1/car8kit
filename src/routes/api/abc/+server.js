import {json} from "@sveltejs/kit";

export const GET = async (req) => {
    const data = Math.random();
    return json({ data });
}

export const POST = GET;