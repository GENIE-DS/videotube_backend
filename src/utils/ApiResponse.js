class ApiResponse {
    constructor(statuscode , data , message = "success"){
        this.statuscode = statuscode
        this.data = data
        this.message = message
        this.success = statuscode < 400
    }
}


export  { ApiResponse }




/*

API Responses 
1XX - Informational
2XX - Success
3XX - Redirection
4XX - Client Error
5XX - Server Error

*/