module.exports = function (req, res, next) {

    // 401 Unauthorized: Tries to access protected resource, but has invalid json webtoken
    // 403 Forbidden: Send a valid token, but are not allowed to access resource because of role
    // Decline access
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    // Pass control to next middleware function (here: route handler)
    // Grant access
    next();

}