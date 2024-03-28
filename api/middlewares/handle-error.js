module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    res.status(500).json({
      status: 'fail',
      data: {
        message: err.message,
      }
    });
  };