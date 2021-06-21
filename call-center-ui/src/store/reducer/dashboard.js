const name = "DASHBOARD";

const types = {
    GET_DASHBOARD_FILTER: `GET_DASHBOARD_FILTER_${name}`,
    GET_DASHBOARD_FILTER_BEGIN: `GET_DASHBOARD_FILTER_BEGIN_${name}`,
    SET_DASHBOARD_FILTER: `SET_DASHBOARD_FILTER_${name}`
}

const initialState = {
    filter: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_DASHBOARD_FILTER_BEGIN: {
            return {
                ...state
            };
        }
        case types.GET_DASHBOARD_FILTER: {
            return {...state};
        }
        case types.SET_DASHBOARD_FILTER: {
            return {
                ...state,
                filter: action.payload
            };
        }
        default:
            return state;
    }
};

export const getDashboardFilter = () => async dispatch => {
    dispatch({type: types.GET_DASHBOARD_FILTER});
}

export const setDashboardFilter = (filter) => async dispatch => {
    dispatch({type: types.GET_DASHBOARD_FILTER_BEGIN});
    dispatch({type: types.SET_DASHBOARD_FILTER, payload: filter});
}