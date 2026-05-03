import jwt from 'jsonwebtoken'
import {client} from '../config/db.js';
export const protectRoute = async (req, res, next) => {
        const token = req.headers.authorization;
    try {
        // console.log("token in protect route", token);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // console.log("JWT secret", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded token", decoded);
        const userId = decoded.id;
        
        const query = "SELECT * FROM users WHERE id = $1";
        const { rows } = await client.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = rows[0]; // attach user to request

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};