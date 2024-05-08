const db = require("../config/db");

exports.createNote = async (data) => {
    const [result] = await db.promise().query(
        "INSERT INTO note (userId, type, content, createdAt) VALUES(?,?,?,?)",
        [data.userId, data.type, data.content, data.time]
    );

    return result;
}

exports.deleteNote = async (id) => {
    const [result] = await db.promise().query(
        "DELETE FROM note WHERE id = ?", [id]
    )

    return result;
}

exports.updateNote = async (data) => {
    const [result] = await db.promise().query(
        "UPDATE note SET content = ?, type = ? WHERE id = ?", [data.content, data.type, data.id]
    )

    return result;
}