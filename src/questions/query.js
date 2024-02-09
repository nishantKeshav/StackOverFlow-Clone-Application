const insertQuestionQuery = () => {
       return `INSERT INTO questions (question_id, title, description, user_id) 
              VALUES (?, ?, ?, ?)`
};

const updateQuestionQuery = () => {
       return `UPDATE questions 
              SET title = ?, description = ? 
              WHERE question_id = ?`
};

const checkQuestionIdQuery = () => {
       return `SELECT user_id 
              FROM questions 
              WHERE question_id = ?`
};

const deleteQuestionQuery = () => {
       return `DELETE FROM questions 
              WHERE question_id = ?`
};
module.exports = { insertQuestionQuery , 
                   updateQuestionQuery ,
                   checkQuestionIdQuery , 
                   deleteQuestionQuery , 
                   checkQuestionIdQuery }
