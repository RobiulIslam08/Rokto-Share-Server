import { ErrorRequestHandler } from "express";

const globalErrorHandler:ErrorRequestHandler = (err, req, res, next) =>{
 console.log(err.statusCode)
}
export default globalErrorHandler