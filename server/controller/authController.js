import {client} from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // you can change this
    );
};

export const signup = async(req, res) => {
    
    const {email,name,password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json({ success: false,message: 'All fields are required'});
    }
   try {
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUserResult = await client.query(existingUserQuery, [email]);
    if(existingUserResult.rows.length > 0){
        return res.status(400).json({ success: false,message: 'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [email, name, hashedPassword];
    const result = await client.query(query, values);
    const user = result.rows[0];
     const token = generateToken(user.id);
     console.log(user);
    res.status(201).json({ success: true,message: 'User created successfully', user: {id: user.id, email: user.email, name: user.name},token});
   } catch (error) {
        console.error(error);
        res.status(500).json({  success: false,message: 'Server error'});
   }   
}
export const login = async (req, res) => {
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);
        if(result.rows.length === 0){
            return res.status(400).json({ success: false,message: 'Invalid credentials'});
        }
        const user = result.rows[0];
         const token = generateToken(user.id);
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ success: false,message: 'Wrong password.Please try again.'});
        }
        res.status(200).json({success: true,message: 'Login successful', user: {id: user.id, email: user.email, name: user.name},token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false,message: 'Server error'});
    }
}

export const logout = (req, res) => {
    res.status(200).json({message: 'Logout successful'});
}

export const getUser = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

export const getPublishedImages = async (req, res) => {
    const userId = req.user.id;
    // console.log(userId);

    try {
        const result = await client.query(
            `SELECT m.*
             FROM messages m
             JOIN chats c ON m.chat_id = c.id
             WHERE c.user_id = $1
             AND m.is_image = true
             AND m.is_published = true
             ORDER BY m.timestamp DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            images: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch images"
        });
    }
};