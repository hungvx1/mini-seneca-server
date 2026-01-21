export class AppError extends Error {
    public readonly code: string
    public readonly status: number

    constructor(params: { code: string; message: string; status: number }) {
        super(params.message)

        this.name = 'AppError'
        this.code = params.code
        this.status = params.status

        // Required to make instanceof work correctly when targeting ES5
        Object.setPrototypeOf(this, new.target.prototype)

        // Optional but recommended: removes constructor from stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export class SenecaError extends Error {
    details?: {
        orig$?: {
            code?: string
            status?: number
            message?: string
        }
    }
}
