import {Content} from "antd/es/layout/layout";
import {Col, Input, Row, Select, Space} from "antd";
import "./callHistory.css";
import CallHistoryTable from "./CallHistoryTable";
import {connect} from "react-redux";
import {getUser, setUserLang} from "../../../store/reducer/user";
import {useState} from "react";

const {Option} = Select;

function CallHistory({textConstants}) {
    const [searchType, setSearchType] = useState(1);
    const [searchedVal, setSearchedVal] = useState("");

    const selectBefore = (
        <Select defaultValue={textConstants.PHONE_NUMBER} onSelect={val => setSearchType(val)}
                className="select-before">
            <Option value="1">{textConstants.PHONE_NUMBER}</Option>
            <Option value="2">{textConstants.TIN}</Option>
        </Select>
    );

    return (<>
        <Content>
            <div className="site-layout-content">
                {/* Filter */}
                <Row style={{marginTop: 10, marginBottom: 20}}>
                    <Col xs={24} md={24}>
                        <Space style={{display: "flex", justifyContent: "flex-start"}}>
                            <Input.Search addonBefore={selectBefore}
                                          className={"filter-item"}
                                          placeholder={searchType == 1 ? textConstants.PLACE_HOLDER_INPUT_PHONE_NUMBER : textConstants.PLACE_HOLDER_INPUT_TIN}
                                          onSearch={val => setSearchedVal(val)}/>
                        </Space>
                    </Col>
                </Row>
                {/* Tables */}
                <CallHistoryTable searchedVal={searchedVal} searchType={searchType}/>
            </div>
        </Content>
    </>);
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    lang: state.user.lang,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getUser, setUserLang}
)(CallHistory);