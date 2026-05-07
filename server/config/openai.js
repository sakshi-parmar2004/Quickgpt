import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// console.log("This is the api key yo," ,  process.env.GEMINI_API_KEY);
export const openai = new OpenAI({
    apiKey:process.env.GEMINI_API_KEY,
    baseURL:"https://generativelanguage.googleapis.com/v1beta/openai/"
});

// const response = await openai.chat.completions.create({
//     model: "gemini-3-flash-preview",
//     messages: [
//         {   role: "system",
//             content: "You are a helpful assistant." 
//         },
//         {
//             role: "user",
//             content: "Explain to me how AI works",
//         },
//     ],
// });

// console.log(response.choices[0].message);