const calendarModel = require('../models/calendar');

exports.createNote = async (req, res, next) => {
    try{
        await calendarModel.createNote({userId: req.body.user.id, type: req.body.type, content: req.body.content, time: req.body.time});
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
        await calendarModel.deleteNote(req.query.id);
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

exports.getNoteByMonth = async (req, res, next) => {
    try{
        //get number of days in the current month
        const { year, month } = req.query;
        const numberOfDays = new Date(year, month, 0).getDate();
        let notes = Array.from({ length: numberOfDays}, () => []);
        const result = await calendarModel.getNoteByMonth({
            userId: req.query.userId, 
            month: req.query.month,
            year: req.query.year
        });
        for(let i = 0; i < result.length; i++){
            let dateObject = new Date(result[i].createdAt);
            notes[dateObject.getDate() - 1].push(result[i]);
        }

        return res.status(200).json({
            status: 'success',
            data: {
                notes
            }
        });
    }catch(err){
        next(err);
    }
}

exports.getNoteByDay = async (req, res, next) => {
    try{
        const result = await calendarModel.getNoteByDay({userId: req.query.userId, month: req.query.month, day: req.query.day, year: req.query.year})
        return res.status(200).json({
            status: 'success',
            data: {
                notes: result
            }
        });
    }catch(err){
        next(err);
    }
}