import axios, { AxiosResponse } from "axios";
import { AxiosInstance } from "axios";
import { ErrorHandler } from "@angular/core";
import { Injectable } from "@angular/core";
import { User } from '../_models/user'
import { Expense } from '../_models/expense'
import { UserService } from '../_services/user.service'

export interface Params {
    [ key: string ]: any;
}
 
export interface GetOptions {
    url: string;
    params?: Params;
}
 
export interface ErrorResponse {
    id: string;
    code: string;
    message: string;
}
 
@Injectable({
    providedIn: "root"
})
export class ApiClient {
    private baseURL: string;
    private axiosClient: AxiosInstance;
    private errorHandler: ErrorHandler;
 
    // I initialize the ApiClient.
    constructor( errorHandler: ErrorHandler ) {
        this.baseURL = "http://localhost:3000";
        this.errorHandler = errorHandler;
 
        // The ApiClient wraps calls to the underlying Axios client.
        this.axiosClient = axios.create({
            timeout: 3000,
            headers: {
                "X-Initialized-At": Date.now().toString()
            }
        });
 
    }
 
    // ---
    // PUBLIC METHODS.
    // ---
    getUsers(params: Params = {}) {
        return this.get<User[]>({
            url: `${this.baseURL}/users`,
            params
        });
    }

    getExpenses(params: Params = {}) {
        return this.get<Expense[]>({
            url: `${this.baseURL}/expense`,
            params
        });
    }

    getExpenseById(id: number) {
        let params = {}
        return this.get<Expense>({
            url: `${this.baseURL}/expense/${id}`,
            params
        });
    }

    deleteExpense(id: number) {
        let params = {}
        return this.delete({
            url: `${this.baseURL}/expense/${id}`, 
            params
        });
    }

    updateExpense(params: Params = {}) {
        return this.put({
            url: `${this.baseURL}/expense`,
            params
        });
    }

    updateUser(params: Params = {}) {
        return this.put({
            url: `${this.baseURL}/user`,
            params
        });
    }

    createUser(params: Params = {}) {
        return this.post({
            url: `${this.baseURL}/users`,
            params
        });
    }

    createExpense(params: Params = {}) {
        console.log(params)
        return this.post({
            url: `${this.baseURL}/expense`,
            params
        });
    }
 
    public async get<T>(options: GetOptions): Promise<T> {
 
        try {
 
            var axiosResponse = await this.axiosClient.request<T>({
                method: "get",
                url: options.url,
                params: options.params
            });
 
            return( axiosResponse.data );
 
        } catch ( error ) {
 
            return( Promise.reject( this.normalizeError( error ) ) );
 
        }
 
    }

    public async post(options: GetOptions) {
        try {
            return await this.axiosClient.post(options.url, options.params).then(response => {
                return (response)
            }).catch(error => {
                return(Promise.reject(this.normalizeError(error)));
            })

        } catch (error) {
            return(Promise.reject(this.normalizeError(error)))
        }
    }

    public async put(options: GetOptions) {
        try {
            return await this.axiosClient.put(options.url, options.params).then(response => {
                return (response)
            }).catch(error => {
                return(Promise.reject(this.normalizeError(error)));
            })

        } catch (error) {
            return(Promise.reject(this.normalizeError(error)))
        }
    }

    public async delete<T>(options: GetOptions) {
        try {
            return await this.axiosClient.delete(options.url, options.params).then(response => {
                return (response)
            }).catch(error => {
                return(Promise.reject(this.normalizeError(error)));
            })

        } catch (error) {
            return(Promise.reject(this.normalizeError(error)))
        }
    }
 
    // ---
    // PRIVATE METHODS.
    // ---
 
    // Errors can occur for a variety of reasons. I normalize the error response so that
    // the calling context can assume a standard error structure.
    private normalizeError( error: any ) : ErrorResponse {
 
        this.errorHandler.handleError( error );
 
        // NOTE: Since I'm not really dealing with a production API, this doesn't really
        // normalize anything (ie, this is not the focus of this demo).
        return({
            id: "-1",
            code: "UnknownError",
            message: "An unexpected error occurred."
        });
 
    }
 
}