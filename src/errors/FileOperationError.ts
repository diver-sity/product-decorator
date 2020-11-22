class FileOperationError extends Error {
    private _error: Error;
    constructor(message?: string, error?: Error) {
        super(message);
        this._error = error;
        Error.captureStackTrace(this, this.constructor);
    }

    get error() {
        return this._error;
    }

}

export default FileOperationError;
