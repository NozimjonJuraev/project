import {combineReducers} from 'redux';

import dashboard from './reducer/dashboard';
import user from "./reducer/user";
import report from "./reducer/report";

export default combineReducers({
    dashboard: dashboard,
    report: report,
    user: user
});