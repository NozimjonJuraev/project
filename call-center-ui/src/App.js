import './App.css';
import {lazy, Suspense} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {Layout, Spin} from "antd";
import AppHeader from "./page/header/AppHeader";
import AppFooter from "./page/footer/AppFooter";
import {getCookie} from "./util/cookie";
import {connect} from "react-redux";

function App({user_data}) {
    const isAuth = !!getCookie("token");

    return (
        <BrowserRouter>
            <div className="App">
                {isAuth ?
                    ((<Layout>
                        <AppHeader/>
                        <Suspense fallback={<Spin tip=""></Spin>}>
                            <Switch>
                                <Route path="/dashboard"
                                       component={lazy(() => user_data.typeOperator === 0 ? import("./page/dashboard/Dashboard") : null)}/>
                                <Route path="/reports"
                                       component={lazy(() => user_data.typeOperator === 0 ? import("./page/dashboard/reports/Reports") : null)}/>
                                <Route path="/call-history"
                                       component={lazy(() => user_data.typeOperator === 0 ? import("./page/dashboard/call_history/CallHistory") : null)}/>
                                <Route path="/calls"
                                       component={lazy(() => user_data.typeOperator === 0 ? null : import("./page/calls/Calls"))}/>
                                <Route><Redirect to={user_data.typeOperator === 0 ? "/dashboard" : "/calls"}/></Route>
                            </Switch>
                        </Suspense>
                        <AppFooter/>
                    </Layout>))
                    : (<Layout>
                        <Suspense fallback={<Spin tip=""></Spin>}>
                            <Switch>
                                <Route exact path="/login" component={lazy(() => import("./page/login/Login"))}/>
                                <Route><Redirect to={"/login"}/></Route>
                            </Switch>
                        </Suspense>
                    </Layout>)
                }
            </div>
        </BrowserRouter>
    );
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data
});

export default connect(
    mapStateToProps,
    {}
)(App);
