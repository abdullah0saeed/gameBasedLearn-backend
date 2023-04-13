const express = require('express');
const { execMap } = require('nodemon/lib/config/defaults');
const router = express.Router();


const control = require('../controller/DaTaConrtoller');
const { updateMany } = require('../models/DaTadb');




router.post('/InsertData/:id',control.upload.single('image'),control.InsertData );
router.post('/TakeData/:id', control.TakeData);
router.patch('/FSEupdateQuesttion/:id',control.UpdateData);
router.delete('/FSEdeleteQuesttion/:id',control.DeleteData);
router.post('/feedback',control.FSEPOSTQuestionsFeedback);
router.get('/feedback/:child_id',control.FSEGETQuestionsFeedback);
module.exports = router;
