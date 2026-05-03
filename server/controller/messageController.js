import { query } from "postgre";

import { client } from "../config/db.js";

import {imagekit} from "../config/imagekit.js";
import { openai } from "../config/openai.js";
import axios from "axios";

export const textController = async (req, res) => {
    const userId = req.user.id;
    const { chatID, prompt } = req.body;

    try {
        // 1. check chat ownership
        // console.log( "chat id and prompt",chatID,prompt);
        const chatCheck = await client.query(
            "SELECT * FROM chats WHERE id = $1 AND user_id = $2",
            [chatID, userId]
        );
        // console.log(chatCheck);
      
        if (chatCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // 2. save user message
        await client.query(
            `INSERT INTO messages (chat_id, is_image, is_published, role, content, timestamp)
             VALUES ($1, false, false, 'user', $2, NOW())`,
            [chatID, prompt]
        );

        // 3. call AI
        const completion = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                { role: "user", content: prompt }
            ],
        });
        // console.log("completion", completion);
        const replyText = completion.choices[0].message.content;
        // console.log("replyText", replyText);
         res.status(200).json({
            success: true,
            reply: replyText
        });
        // 4. save assistant message
        await client.query(
            `INSERT INTO messages (chat_id, is_image, is_published, role, content, timestamp)
             VALUES ($1, false, false, 'assistant', $2, NOW())`,
            [chatID, replyText]
        );

        // 5. return response
       

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


export const imageController = async (req, res) => {
    const userId = req.user.id;
    const { chatID, prompt , isPublished } = req.body;
     console.log(chatID,prompt);
    try {
        // 1. check chat ownership
        const chatCheck = await client.query(
            "SELECT * FROM chats WHERE id = $1 AND user_id = $2",
            [chatID, userId]
        );
      
        if (chatCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // 2. save user prompt
        await client.query(
            `INSERT INTO messages (chat_id, is_image, is_published, role, content, timestamp)
             VALUES ($1, false, false, 'user', $2, NOW())`,
            [chatID, prompt]
        );
        
        const encodedPrompt = encodeURIComponent(prompt);
        console.log(encodedPrompt);
        const generatedImageURL = `${process.env.URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`
        console.log(generatedImageURL);
        const aiResponse = await axios.get(generatedImageURL, {
        responseType: "arraybuffer"});
        console.log("ai",aiResponse);

const base64Img = Buffer.from(aiResponse.data).toString("base64");
// console.log( "base64 ",base64Img)
// optional: add MIME type (recommended)
const finalImage = `data:image/png;base64,${base64Img}`;
        // 3. generate image
        const UploadResponse = await imagekit.files.upload({
             file: base64Img,
  fileName: `${Date.now()}.png`,
  folder:"quickgpt"
        })

        const reply = {
            role:"assistant",
            content:UploadResponse.url,
            timestamp:Date.now(),
            isImage:true,
            isPublished
        }
         // 5. send response
        res.status(200).json({
            success: true,
            reply });

        // 4. save assistant image message
        await client.query(
            `INSERT INTO messages (chat_id, is_image, is_published, role, content, timestamp)
             VALUES ($1, true, true, 'assistant', $2, NOW())`,
            [chatID, UploadResponse.url]
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Image generation failed"
        });
    }
};


export const getmessagesController = async (req, res) => {
    const userId = req.user.id;
    const { chatID } = req.params;
    console.log( "chat Id & userId", chatID, userId);
    try {
        // 1. check chat ownership
        const chatCheck = await client.query(
            "SELECT * FROM chats WHERE id = $1 AND user_id = $2",
            [chatID, userId]
        );  
        // console.log("chat check",chatCheck);
        if (chatCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }
        // 2. fetch messages
        const messagesRes = await client.query(
            "SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC", 
            [chatID]
        );
        // console.log("messages",messagesRes.rows);
        res.status(200).json({
            success: true,
            messages: messagesRes.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};
