/**
 * @desc Higher-order function to standardize asynchronous error handling 
 * and eliminate redundant try-catch blocks in controllers.
 * 
 * @param {Function} requestHandler - The controller function to be wrapped
 * @returns {Function} - A middleware-ready function that catches errors
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Resolves the promise and automatically passes any 
        // rejected errors to the next middleware (Global Error Handler)
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };