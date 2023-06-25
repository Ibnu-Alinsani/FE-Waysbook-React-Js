import { createContext, useReducer } from "react"
import { setAuthToken } from "../config/api"

export const UserContext = createContext()

export const initialState = {
    IsLogin : false,
    user: {},
    refetch: null
}   

const reducer = (state, action) => {
    const {type,payload,cart} = action
    switch (type) {
        case "USER_SUCCESS" :
        case "LOGIN_SUCCESS":
            localStorage.setItem("token", payload.token)
            setAuthToken(payload.token)

            return {
                IsLogin: true, 
                user: payload,
                cart: cart
            }

            case "AUTH_ERROR":
            case "LOGOUT":
                localStorage.removeItem("token")
                return { 
                    IsLogin: false,
                    user: {},
                }

            default : 
                throw new Error()
    }
}

export const UserContextProvider = ({children}) => {
    const [state, dispatch] =  useReducer(reducer, initialState);

    return (    
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )
}