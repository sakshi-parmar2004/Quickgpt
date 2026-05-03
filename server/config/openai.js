import OpenAI from "openai";


console.log("This is the api key yo," ,  process.env.GEMINI_API_KEY);
export const openai = new OpenAI({
    apiKey:"AIzaSyCwcT8ZBZlZJaj1O2PpxURayEEI9FbXUsE",
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