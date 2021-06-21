import {getCookie} from "../../util/cookie";
import textLangRu from "../../config/textLangRu";
import textLangUz from "../../config/textLangUz";

const name = "USER";

const types = {
    GET_USER: `GET_USER_${name}`,
    GET_USER_BEGIN: `GET_USER_BEGIN_${name}`,
    SET_USER: `SET_USER_${name}`,
    SET_USER_LANG: `SET_USER_LANG_${name}`,
    SET_USER_CURRENT_CALL: `SET_USER_CURRENT_CALL_${name}`
}

const initialState = {
    user_data: getCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : {},
    lang: getCookie("lang") ? getCookie("lang") : "ru",
    textConstants: (getCookie("lang") ? getCookie("lang") : "ru") === "ru" ? textLangRu : textLangUz,
    currentCall: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_USER_BEGIN: {
            return {
                ...state
            };
        }
        case types.GET_USER: {
            return {...state};
        }
        case types.SET_USER: {
            return {
                ...state,
                user_data: action.payload
            };
        }
        case types.SET_USER_LANG: {
            return {
                ...state,
                lang: action.payload,
                textConstants: action.payload === "ru" ? textLangRu : textLangUz
            };
        }
        case types.SET_USER_CURRENT_CALL: {
            return {
                ...state,
                currentCall: action.payload
            };
        }
        default:
            return state;
    }
};

export const getUser = () => async dispatch => {
    dispatch({type: types.GET_USER});
}

export const setUser = (userData) => async dispatch => {
    dispatch({type: types.GET_USER_BEGIN});
    dispatch({type: types.SET_USER, payload: userData});
}

export const setUserLang = (userLang) => async dispatch => {
    dispatch({type: types.SET_USER_LANG, payload: userLang});
}

export const setUserCurrentCall = (currentCall) => async dispatch => {
    dispatch({type: types.SET_USER_CURRENT_CALL, payload: currentCall});
}