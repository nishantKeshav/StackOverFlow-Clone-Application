const insertCommentQuery = () => {
       return `INSERT INTO comments (comment_id, content, answer_id, user_id) 
              VALUES (?, ?, ?, ?)`;
};

const checkAnswerIdQuery = () => {
       return `SELECT user_id 
              FROM answers 
              WHERE answer_id = ?`
};

const updateCommentQuery = () => {
       return `UPDATE comments 
              SET content = ? 
              WHERE comment_id = ?`
};

const checkCommentIdQuery = () => {
       return `SELECT user_id 
              FROM comments 
              WHERE comment_id = ?`
};

const deleteCommentQuery = () => {
       return `DELETE FROM comments 
              WHERE comment_id = ?`
};
module.exports = { insertCommentQuery  ,
                   checkAnswerIdQuery , 
                   updateCommentQuery , 
                   checkCommentIdQuery , 
                   deleteCommentQuery };
