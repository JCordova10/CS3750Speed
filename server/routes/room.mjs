import express from "express";
import db from "../config/db.mjs";
import { ObjectId } from "mongodb";
const router = express.Router();

router.post("/createRoom", async(req, res) => {
    const {gameType, user1} = req.body;
    const user2 = "";
    let collection = db.collection("Game-Room");
    let result = await collection.insertOne({gameType, user1, user2});

    if (result && result.insertedId) {
        const newRoom = {
            _id: result.insertedId,
            gameType,
            user1,
            user2
        };
        console.log(newRoom);
        res.status(200).send(newRoom);
    } else {
        res.status(500).send({ message: "Failed to insert room." });
    }
});


router.get("/getRooms", async (req, res) => {
    try {
        let collection = db.collection("Game-Room");
        
        // Use 'find' and 'toArray' to get all the documents
        let result = await collection.find().toArray();

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching rooms");
    }
});

router.put("/updateUser2", async(req, res) => {
    const { roomId, user2 } = req.body;

    let collection = db.collection("Game-Room");

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(roomId) },
            { $set: { user2 } }
        );
        console.log(result);
        if (result.modifiedCount === 1) {
            const updatedRoom = await collection.findOne({ _id: new ObjectId(roomId) });
            console.log(updatedRoom);
            res.status(200).send(updatedRoom);
        } else {
            res.status(500).send({ message: "Failed to update user2." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
export default router;