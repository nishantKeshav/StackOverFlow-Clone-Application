const insertUserQuery = () => {
       return `INSERT INTO users (user_id, username, password) 
              VALUES (?, ?, ?)`;
};
const checkUserQuery = () => {
       return `SELECT user_id, username, password
              FROM users
              WHERE username = ?`;
};
module.exports = { insertUserQuery , checkUserQuery }; 