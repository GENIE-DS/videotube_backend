
// promises version
const asyncHandler = (requestHandler)=>{
    return (req , res , next)=>{
        Promise.resolve(requestHandler(req, res , next))
        .catch((err)=>next(err))
    }
}




export {asyncHandler}



//  try catch version 

// //since this is a higher order fn.
// const asyncHandler = () => {}
// // but we need to execute the function as well .. so 
// const asyncHandler = (func) => {() => {}}

// // just remove the curley braces and we get (as you know if you remove braces of arrow fn , it anyways returns whats written , implicitely )
// const asyncHandler = (fn) => () => {}

// // to make it async now 
// const asyncHandler = (fn) => async () => {}
// // so basically in above , we are taking a fn as input and outputting another async fn  that is 'async ()=>{}'

// const asyncHandler = (fn) => async (req , res , next) => {
//     try {
//         await fn(req , res , next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message,
//         })
//     }
// }