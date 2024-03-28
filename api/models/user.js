const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (userData) => {
    const {
        name,
        email,
        password,
    } = userData;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query('INSERT INTO user (name, email, password, created_at, updated_at) VALUES(?,?,?,?,?)', [name, email, hashedPassword, new Date(), new Date()]);
    return result.insertId;
};

exports.getUserByEmail = async (email) => {
    const [rows] = await db.promise().query('SELECT * FROM user WHERE email = ? LIMIT 1', [email]);
    return rows[0];
}

exports.getUserById = async(id) => {
    const [rows] = await db.promise().query('SELECT * FROM user WHERE id = ? LIMIT 1', [id]);
    return rows[0];
}

exports.updateUser = async(data) => {
    await db.promise().query(
        "UPDATE user SET name = ?, bio = ?, phone = ?, gender = ? WHERE id = ?",
        [data.name, data.bio, data.phone, data.gender, data.id]
    );
}