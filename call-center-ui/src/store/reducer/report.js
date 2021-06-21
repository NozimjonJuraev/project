const name = "REPORT";

const types = {
    GET_REPORT_FILTER: `GET_REPORT_FILTER_${name}`,
    GET_REPORT_FILTER_BEGIN: `GET_REPORT_FILTER_BEGIN_${name}`,
    SET_REPORT_FILTER: `SET_REPORT_FILTER_${name}`
}

const initialState = {
    filter: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_REPORT_FILTER_BEGIN: {
            return {
                ...state
            };
        }
        case types.GET_REPORT_FILTER: {
            return {...state};
        }
        case types.SET_REPORT_FILTER: {
            return {
                ...state,
                filter: action.payload
            };
        }
        default:
            return state;
    }
};

export const getReportFilter = () => async dispatch => {
    dispatch({type: types.GET_REPORT_FILTER});
}

export const setReportFilter = (filter) => async dispatch => {
    dispatch({type: types.GET_REPORT_FILTER_BEGIN});
    dispatch({type: types.SET_REPORT_FILTER, payload: filter});
}