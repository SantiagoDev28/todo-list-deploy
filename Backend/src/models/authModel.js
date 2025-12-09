import bcrypt from "bcryptjs";
import { pool } from "../../Database/connection.js";

const saltRounds = 10;

class AuthModel {
    // ============================================================
    // FIND USER BY EMAIL
    // ============================================================
    static async findUserByEmail(email) {
        const query = `
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

        const [rows] = await pool.execute(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    // ============================================================
    // CREATE USER (SIGN UP)
    // ============================================================
    static async createUser({ name, email, password }) {
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `;

        const [result] = await pool.execute(query, [name, email, passwordHash]);

        return {
            id: result.insertId,
            name,
            email,
        };
    }

    // ============================================================
    // VALIDATE PASSWORD
    // ============================================================
    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // ============================================================
    // SIGN UP LOGIC (REGISTER)
    // ============================================================
    static async registerUser({ name, email, password }) {
        const existingUser = await this.findUserByEmail(email);

        if (existingUser) {
            return { success: false, message: "Email is already registered." };
        }

        const newUser = await this.createUser({ name, email, password });

        return { success: true, user: newUser };
    }

    // ============================================================
    // LOGIN LOGIC
    // ============================================================
    static async loginUser({ email, password }) {
        const user = await this.findUserByEmail(email);

        if (!user) {
            return { success: false, message: "Invalid credentials." };
        }

        const isValid = await this.validatePassword(
            password,
            user.password_hash
        );

        if (!isValid) {
            return { success: false, message: "Invalid credentials." };
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    // ============================================================
    // FIND USER BY ID (FOR TOKEN VERIFICATION)
    // ============================================================
    static async findUserById(id) {
        const query = `
    SELECT id, name, email
    FROM users
    WHERE id = ?
    LIMIT 1
  `;

        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
}

export default AuthModel;
