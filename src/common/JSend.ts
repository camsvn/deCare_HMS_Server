enum JSendStatus {
    SUCCESS = 'success',
    FAIL = 'fail',
    ERROR = 'error'
}

type ErrorResponse = {
    status: JSendStatus.ERROR,
    message: string
}

type ErrorDataResponse = {
    status: JSendStatus.ERROR,
    message: string,
    data: string | object
}

export function successResponse (data?: object | string) {
    return {
        status: JSendStatus.SUCCESS,
        data: data ? data : null
    }
}

export function failResponse (data?: object | string) {
    return {
        status: JSendStatus.FAIL,
        data: data ? data : null
    }
}

export function errorResponse (message: string, data?: object | string): ErrorResponse | ErrorDataResponse {
    const baseErrorResponse: ErrorResponse = {
        status: JSendStatus.ERROR,
        message
    }

    if (data) return {
        ...baseErrorResponse,
        data
    };
    else return {
        ...baseErrorResponse
    }
}