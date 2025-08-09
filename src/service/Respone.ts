export enum STATUS {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
}

interface Responsetype {
    message : string,
    status : STATUS,
    data? : any
}

export const Response = ({message, status, data=null} : Responsetype) => {
    return {
        message,
        status,
        data
    }
}