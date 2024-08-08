const { get } = require("mongoose");
const pool = require("./pool");

async function getAllPosts() {
  const { rows } = await pool.query(
    "SELECT posts.id, title, TO_CHAR(timestamp, 'DD/MM/YYYY HH24:MI:SS') AS formatted_timestamp, content, CONCAT(first_name, ', ', last_name) full_name, username FROM posts JOIN users ON creator_id=users.id ORDER BY timestamp DESC"
  );
  return rows;
}

async function getUserById(userId) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [
    userId,
  ]);
  return rows[0];
}

async function getUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
  return rows[0];
}

async function insertUser(user, hasedPassword) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, email, password, membership_status, admin) VALUES ($1, $2, $3, $4, $5, $6, $6)",
    [
      user.firstname,
      user.lastname,
      user.username,
      user.email,
      hasedPassword,
      user.admin,
    ]
  );
}

async function insertPost(post, creatorId) {
  await pool.query(
    "INSERT INTO posts (title, content, creator_id) VALUES ($1, $2, $3)",
    [post.title, post.content, creatorId]
  );
}

async function updateMembershipStatus(userId, status) {
  await pool.query("UPDATE users SET membership_status=$1 WHERE id=$2", [
    status,
    userId,
  ]);
}

async function deletePostById(postId) {
  await pool.query("DELETE FROM posts WHERE id=$1", [postId]);
}

module.exports = {
  getAllPosts,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  insertUser,
  insertPost,
  updateMembershipStatus,
  deletePostById,
};
