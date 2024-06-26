export const catchAsyncError = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (err) {
        next(err);
    }
};
