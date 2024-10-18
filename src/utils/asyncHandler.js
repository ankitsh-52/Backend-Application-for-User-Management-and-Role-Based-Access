// const asyncHandler = (fun) => {
//     return function (req, res, next) {
//         Promise.resolve(fun(req, res, next)).catch((err) => {next(err)})
//     }
// }

// export {asyncHandler}

const asyncHandler = (fn) => {
    return function (req, res, next) {
        // Wrap the async function call in a Promise to ensure that the return value can be handled
        Promise.resolve(fn(req, res, next))
            .then((result) => {
                // Here you can do something with the result if needed
                return result; // Return the result if necessary
            })
            .catch(next); // Automatically pass any errors to next()
    };
};

export {asyncHandler}
