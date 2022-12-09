import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const docRef = db.doc(`npcs/${id}`);
    const doc = await docRef.get();
    const data = await new Promise<FirebaseFirestore.DocumentData|undefined>((resolve) => {
        const unsubscribe = docRef.onSnapshot((doc) => {
            const data = doc.data();
            if(data && data.Image) {
                unsubscribe();
                resolve(data);
            }
        });
    });
    if(data === undefined) {
        console.log("Not found");
        res.status(404).send("Not found");
        return;
    }
    res.redirect(data?.Image).end();
};

export default handler;