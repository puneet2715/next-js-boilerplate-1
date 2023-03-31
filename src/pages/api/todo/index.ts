import connectDB from "@/database/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllTodoData, postTodoData } from "@/services/api.service";
import logger from "@/utils/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    logger.info("Request Method: ", req.method);
    try {
        switch (req.method) {
            case "GET": {
                const [responseBody, statusCode] = await getAllTodoData(req.query)
                res.status(statusCode).send(responseBody);
                break;
            }

            case "POST": {
                const [responseBody, statusCode] = await postTodoData(req.body)
                res.status(statusCode).send(responseBody);
                break;
            }

            default: {
                res.status(404).send({ message: "Request Method Not found" })
                break;
            }
        }
    } catch (err) {
        res.status(400).send({ message: (err as Error).message });
    }
}



