const calendarModel = require('../models/calendar');

exports.createNote = async (req, res, next) => {
    try{
        await calendarModel.createNote({userId: req.body.user.id, type: req.body.type, content: req.body.content});
        return res.status(201).json({
            status: 'success',
            data: {
                message: 'Note created successfully.'
            }
        })
    }catch(err){
        next(err);
    }
}

exports.deleteNote = async (req, res, next) => {
    try{
        await calendarModel.deleteNote(req.body.id);
        return res.status(200).json({
            status: 'success',
            data: {
                message: 'The note was deleted.'
            }
        })
    }catch(err){
        next(err);
    }
}

exports.updateNote = async (req, res, next) => {
    try{
        await calendarModel.updateNote(req.body);
        return res.status(200).json({
            statusbar: 'success',
            data: {
                message: 'Note updated successfully.'
            }
        });
    }catch(err){
        next(err);
    }
}