const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    // If token is not valid it will throw an exception >> therefore the try block
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));  // Mit PrivateKey kann ich das Token dekodieren
        req.user = decoded;
        next();
    } 
    catch (ex) {
        res.status(400).send('Invalid token');
    }
}