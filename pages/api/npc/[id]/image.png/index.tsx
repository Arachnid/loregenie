import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    console.log({id})
    const docRef = db.doc(`npcs/${id}`);
    const doc = await docRef.get();
    let data = doc.data();
    console.log(data);
    if(data === undefined) {
        console.log("Not found");
        res.status(404).send("Not found");
        return;
    }
    console.log(data.image);
    if(data.image === undefined) {
        data = await new Promise((resolve) => {
            console.log("Waiting");
            const unsubscribe = docRef.onSnapshot((doc) => {
                data = doc.data();
                if(data && data.image) {
                    console.log("Arrived!");
                    unsubscribe();
                    resolve(data);
                }
            });
        });
    }
    console.log(`Redirecting to ${data?.image}`);
    res.redirect(data?.image).end();
};

export default handler;