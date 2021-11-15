import {
    SET_ERROR_MESSAGE,
    SET_DEFAULT_ACCOUNT,
    SET_IS_CONNECTED,
    SET_CURRENT_CONTRACT_VALUE,
    SET_PROVIDER,
    SET_SIGNER,
    SET_CONTRACT,
} from '_actions/ethereum';

import {
    LOGOUT_USER
} from '_actions/user';

export default function ethereum(state = {}, action) {

    switch (action.type) {
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: action.payload,
            };
        case SET_DEFAULT_ACCOUNT:
            return {
                ...state,
                defaultAccount: action.payload,
            };
        case SET_IS_CONNECTED:
            return {
                ...state,
                connected: action.payload,
            };
        case SET_CURRENT_CONTRACT_VALUE:
            return {
                ...state,
                contractValue: action.payload,
            };
        case SET_PROVIDER:
            return {
                ...state,
                provider: action.payload,
            };
        case SET_SIGNER:
            return {
                ...state,
                signer: action.payload,
            };
        case SET_CONTRACT:
            return {
                ...state,
                contract: action.payload,
            };
        case LOGOUT_USER:
            return [];
        default:
            return state;
    }
}