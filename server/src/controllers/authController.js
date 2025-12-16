// server/src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

// 1. REGISTER User
export const register = async (req, res) => {
    try {
        const { name, email, password, role, rollNo, classId } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create User AND Student/Teacher profile together
        const newUser = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role || "STUDENT",
                },
            });

            // 2. Create Student Profile (If role is STUDENT)
            if (role === "STUDENT" && rollNo && classId) {
                await tx.student.create({
                    data: {
                        rollNo,
                        userId: user.id,
                        classId: parseInt(classId), // ensure integer
                    },
                });
            }

            return user;
        });

        res.status(201).json({ message: "User registered successfully!", user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed!", error: error.message });
    }
};

// 2. LOGIN User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" } // Token expires in 1 day
        );

        res.status(200).json({ 
            message: "Login successful!", 
            token, 
            user: { id: user.id, name: user.name, role: user.role } 
        });

    } catch (error) {
        res.status(500).json({ message: "Login failed!", error: error.message });
    }
};