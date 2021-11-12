module.exports = function (handler) {
    // Return a standard route handler
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);  // Error Middleware in index.js ist die letzte, zu der man immer gelangt, dort wird exception als Parameter übergeben
        }    
    };  
}