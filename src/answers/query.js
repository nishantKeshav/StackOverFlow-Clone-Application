const insertAnswerQuery = () => {
       return `INSERT INTO answers (answer_id, content, question_id, user_id) 
              VALUES (?, ?, ?, ?)` 
};

const checkQuestionIdQuery = () => {
       return `SELECT user_id 
              FROM questions 
              WHERE question_id = ?`
}

const checkAnswerIdQuery = () => {
       return `SELECT user_id 
              FROM answers 
              WHERE answer_id = ?`
}
const updateAnswerQuery = () => {
       return `UPDATE answers 
              SET content = ? 
              WHERE answer_id = ?`
}
const deleteAnswerQuery = () => {
       return `DELETE FROM answers 
              WHERE answer_id = ?`
}
module.exports = { insertAnswerQuery ,
                   checkQuestionIdQuery ,
                   checkAnswerIdQuery  ,
                   updateAnswerQuery ,
                   deleteAnswerQuery }