/**
 * @desc Standardized Response class for CareerForge API
 * This ensures the frontend always receives data in a consistent format.
 */
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        // Automatically determines success based on HTTP status codes
        this.success = statusCode < 400;
    }
}

export { ApiResponse };