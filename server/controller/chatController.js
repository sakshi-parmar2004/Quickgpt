import { client } from "../config/db.js";

export const createChat = async (req, res) => {
    const userId = req.user.id;  // from auth middleware
    // const { name } = req.user;

    try {
        // generate unique id (you can also use uuid)
        const chatId = Date.now().toString();

        const result = await client.query(
            `INSERT INTO chats (id, user_id, user_name, name, created_at, updated_at)
             VALUES ($1, $2, $3, $4, NOW(), NOW())
             RETURNING *`,
            [chatId, userId, req.user.name || "User", "New Chat"]
        );
        // console.log("result",result.rows[0]);
        res.status(201).json({
            success: true,
            chat: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create chat"
        });
    }
};

export const getChats = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await client.query(
            "SELECT * FROM chats WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.status(200).json({
            success: true,
            chats: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch chats"
        });
    }
};

export const deleteChat = async (req, res) => {
    const {chatId} = req.params;
    const userId = req.user.id;

    try {
        // Optional: ensure user owns the chat
        const result = await client.query(
            "DELETE FROM chats WHERE id = $1 AND user_id = $2 RETURNING *",
            [chatId, userId]
        );
        // const deletemessage = await client.query(
        //     "DELETE FROM messages WHERE chat_id = $1",
        //     [chatId]
        // );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete chat"
        });
    }
};