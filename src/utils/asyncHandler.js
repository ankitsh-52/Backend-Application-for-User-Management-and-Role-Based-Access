const asyncHandler = (fun) => {
    return function (req, res, next) {
        Promise.resolve(fun(req, res, next)).catch((err) => {next(err)})
    }
}

export {asyncHandler}

// const asyncHandler = (fun) => 
// {
//     return (req, res, next) => 
//     {
//          fun(req, res, next).catch((err) => {next(err)})
//     }
// };
