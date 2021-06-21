import {Button, Col, Form, Input, message, Modal, Radio, Row, Select} from "antd";
import {apiUrl} from "../../../config/const";
import axios from "axios";
import "./registration.css";
import {useEffect, useState} from "react";
import {HistoryOutlined} from "@ant-design/icons";
import {connect} from "react-redux";
import {getUser} from "../../../store/reducer/user";
import ClientCallHistory from "./ClientCallHistory";

const {TextArea} = Input;
const {Option} = Select;

function Registration({inf2, visible, setvisible, item, user_data, textConstants, getUser}) {
    const [form] = Form.useForm();
    const [regionList, setRegionList] = useState([{}]);
    const [districtList, setDistrictList] = useState([{}]);
    const [tinTypeList, setTinTypeList] = useState([{}]);
    const [categoryList, setCategoryList] = useState([{}]);
    const [subCategoryList, setSubCategoryList] = useState([{}]);
    const [themeList, setThemeList] = useState([{}]);
    const [resultList, setResultList] = useState([{}]);
    const [isInformative, setIsInformative] = useState(1);
    const [responsiblePerson, setResponsiblePerson] = useState({});
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(0);
    const [selectedThemeId, setSelectedThemeId] = useState(0);
    const [shortInfo, setShortInfo] = useState({});
    const [personInfoByTin, setPersonInfoByTin] = useState({});
    const [clientCallHistoryModalVisible, setClientCallHistoryModalVisible] = useState(false);
    const isRequired = true;

    const closeFormWindow = e => {
        setvisible(false);
    };

    const saveSuccessMessage = () => {
        message.success({
            content: textConstants.SAVE,
            className: 'custom-class',
            duration: 1.5,
            style: {
                marginTop: '20vh',
            },
        });
    };

    const saveForm = (values) => {
        const body = {
            isInformative: values.isInformative,
            applicationDescription: values.application_description,
            tin: values.tin,
            applicantTypeId: values.applicant_type_id,
            regionId: values.region_id,
            districtId: values.district_id,
            phoneNumber: values.phone_number,
            additionalPhoneNumber: values.additional_phone_number,
            mail: values.mail,
            categoryId: values.category_id,
            subCategoryId: values.sub_category_id,
            themeId: values.theme_id,
            resultId: values.result_id,
            note: values.note,
            createdOperatorId: user_data.userId,
            callId: item.id,
            sourceId: shortInfo.typeOperator,
            subSourceId: values.sub_source_id,
            applicantName: values.applicant_name,
            address: values.address,
            inf2: (parseInt(inf2) > 0 ? parseInt(inf2) : (shortInfo.typeOperator === 1 ? 6000 : 6001)),
            recFile: item.recFile,
            linkedId: item.linkedId == undefined ? "" : item.linkedId
        };

        axios({
            method: "post",
            url: `${apiUrl}/call-center/reg-applicant/add`,
            data: body,
            headers: {"Content-Type": "application/json"},
        }).then(function (response) {
            saveSuccessMessage();
            closeFormWindow();
        }).catch(function (response) {
            console.error(response);
        });
    };

    const saveFormFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    const getDistricts = regionId => {
        axios.get(`${apiUrl}/call-center/ref/getDistricts?region_id=${regionId}`).then(res => {
            if (res.status === 200 && res.data) {
                setDistrictList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    const getSubCategoryList = categoryId => {
        axios.get(`${apiUrl}/call-center/ref/getSubCategories?category_id=${categoryId}`).then(res => {
            if (res.status === 200 && res.data) {
                form.setFieldsValue({
                    sub_category_id: null,
                    theme_id: null
                });
                setSubCategoryList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    const getThemeList = subCategoryId => {
        setSelectedSubCategoryId(subCategoryId);
        getResponsiblePerson();
        axios.get(`${apiUrl}/call-center/ref/getThemes?sub_category_id=${subCategoryId}`).then(res => {
            if (res.status === 200 && res.data) {
                form.setFieldsValue({
                    theme_id: null
                });
                setThemeList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    const setThemeId = themeId => {
        setSelectedThemeId(themeId);
        getResponsiblePerson();
    }

    useEffect(() => {
        axios.get(`${apiUrl}/call-center/reg-applicant/get-short-info?login=${user_data.login}&phone_number=${item.snum}`).then(res => {
            if (res.status === 200 && res.data) {
                setShortInfo(res.data);
            }
        }).catch(err => {
            console.error(err);
        });

        axios.get(`${apiUrl}/call-center/ref/getTinTypes`).then(res => {
            if (res.status === 200 && res.data) {
                setTinTypeList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });

        axios.get(`${apiUrl}/call-center/ref/getRegions`).then(res => {
            if (res.status === 200 && res.data) {
                setRegionList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });

        axios.get(`${apiUrl}/call-center/ref/getCategories?call_center_type=${user_data.typeOperator === 1 ? 6000 : 6001}`).then(res => {
            if (res.status === 200 && res.data) {
                setCategoryList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });

        axios.get(`${apiUrl}/call-center/ref/getResultTypes`).then(res => {
            if (res.status === 200 && res.data) {
                setResultList(res.data);
            }
        }).catch(err => {
            console.error(err);
        });
    }, []);

    const getResponsiblePerson = data => {
        axios.get(`${apiUrl}/call-center/ref/getResponsiblePerson?sub_category_id=${selectedSubCategoryId}&theme_id=${selectedThemeId}`).then(res => {
            if (res.status === 200 && res.data) {
                setResponsiblePerson(res.data);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    const getTinInfo = e => {
        const tin = e.target.value;

        if (tin.length === 9) {
            axios.get(`${apiUrl}/call-center/reg-applicant/get-tin-info?tin=${tin}`).then(res => {
                if (res.status === 200 && res.data) {
                    setPersonInfoByTin(res.data);

                    getDistricts(res.data.ns10Code);
                    form.setFieldsValue({
                        applicant_name: res.data.name,
                        address: res.data.address,
                        region_id: res.data.ns10Code,
                        district_id: res.data.ns11Code,
                        applicant_type_id: ((tin.substring(0, 1) === 2 || tin.substring(0, 1) === 3) ? 1 : 2)
                    });
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }

    const isSocialMediaUser = shortInfo.typeOperator === 3 ? true : false;

    return (
        <>
            <Modal
                class="reg_modal"
                title={textConstants.REGISTRATE_APPLICATION}
                visible={visible}
                width={1100}
                footer={false}
                closable={false}
                maskClosable={false}
                toggle={closeFormWindow}
            >
                <Form form={form} name="form_in_modal" initialValues={{
                    remember: true,
                    phone_number: item.snum,
                    isInformative: 1
                }}
                      onFinish={saveForm}
                      onFinishFailed={saveFormFailed}>
                    <Row>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.OPERATOR}</i>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.OPERATOR_NAME}</i>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.CALL_HISTORY_COUNT}</i>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <b></b>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <h3 style={{borderBottom: '1px solid black'}}>{shortInfo.operatorName}</h3>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <h3 style={{borderBottom: '1px solid black'}}>{shortInfo.name}</h3>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <h3 style={{borderBottom: '1px solid black'}}>{shortInfo.countLetter}</h3>
                            </div>
                        </Col>
                        <Col xs={24} md={6}>
                            <div style={{textAlign: "center", marginLeft: 5, marginRight: 5, marginTop: -5}}>
                                <Button type="primary" icon={<HistoryOutlined/>} size={'medium'}
                                        onClick={() => setClientCallHistoryModalVisible(true)}>{textConstants.CALL_HISTORY}</Button>
                            </div>
                        </Col>
                    </Row>
                    {isSocialMediaUser ?
                        <Row>
                            <Col xs={24} md={24}>
                                <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                    <i style={{fontStyle: "normal"}}>{textConstants.OPERATOR_TYPE}</i>
                                </div>
                            </Col>
                        </Row> : null}
                    {isSocialMediaUser ?
                        <Row>
                            <Col xs={24} md={4}>
                                <Form.Item name="sub_source_id" className="form-input"
                                           rules={[{
                                               required: isRequired,
                                               message: "введите информацию!"
                                           }]}>
                                    <Select style={{width: '100%', margin: 0}}>
                                        <Option key={1} value={1}>Telegram</Option>
                                        <Option key={2} value={2}>Facebook</Option>
                                        <Option key={3} value={3}>Istragram</Option>
                                    </Select>
                                </Form.Item>
                            </Col></Row> : null
                    }
                    <Row style={{marginTop: 15, marginBottom: 15}}>
                        <Col xs={24} md={24}>
                            <Form.Item name="isInformative" className="form-input-social">
                                <Radio.Group name="radiogroup" initialValues={1}
                                             onChange={val => setIsInformative(val.target.value)}>
                                    <Radio value={1}>{textConstants.INFORMATIVE_APPLICATION}:</Radio>
                                    <Radio value={0}>{textConstants.FORMING_APPLICATION}:</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    {isInformative === 0 ? <Row>
                        <Col xs={24} md={24}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.APPLICATION_DESCRIPTION}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                    </Row> : null}
                    {isInformative === 0 ? <Row>
                        <Col xs={24} md={24}>
                            <Form.Item name="application_description"
                                       className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <TextArea rows={3} placeholder="..."/>
                            </Form.Item>
                        </Col>
                    </Row> : null}
                    {/* 3 - qator*/}
                    {isInformative === 0 ? <Row>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.TIN}:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={20}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.APPLICANT_NAME}:</i>
                            </div>
                        </Col>
                    </Row> : null}
                    {isInformative === 0 ? <Row>
                        <Col xs={24} md={4}>
                            <Form.Item name="tin" className="form-input">
                                <Input onChange={d => getTinInfo(d)} type="number" placeholder="..."/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={20}>
                            <Form.Item name="applicant_name" className="form-input">
                                <Input placeholder="..."/>
                            </Form.Item>
                        </Col>
                    </Row> : null}
                    <Row>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.TAXPAYER_TYPE}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.REGION}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.DISTRICT}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.PHONE_NUMBER}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.EXTRA_PHONE_NUMBER}:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={4}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.MAIL}:</i>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={4}>
                            <Form.Item name="applicant_type_id" className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    style={{width: '100%'}}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    allowClear>
                                    {tinTypeList.map(tinType => <Option key={tinType.id}
                                                                        value={tinType.id}>{tinType.nameUz}</Option>)};
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item shouldUpdate={() => true} name="region_id" className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <Select showSearch
                                        defaultValue={personInfoByTin.ns10Code}
                                        optionFilterProp="children"
                                        style={{width: '100%'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                        onSelect={getDistricts}>
                                    {regionList.map(region => <Option key={region.id}
                                                                      value={region.id}>{region.nameUz}</Option>)};>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item name="district_id" className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <Select showSearch
                                        optionFilterProp="children"
                                        style={{width: '100%'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear>
                                    {districtList.map(district => <Option key={district.id}
                                                                          value={district.id}>{district.nameUz}</Option>)};>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item name="phone_number" className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <Input placeholder="..."/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item name="additional_phone_number" className="form-input">
                                <Input placeholder="..."/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item name="mail" className="form-input">
                                <Input placeholder="..."/>
                            </Form.Item>
                        </Col>
                    </Row>
                    {isInformative === 0 ? <Row>
                        <Col xs={24} md={24}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.ADDRESS}:</i>
                            </div>
                        </Col>
                    </Row> : null}
                    {isInformative === 0 ? <Row>
                        <Col xs={24} md={24}>
                            <Form.Item name="address" className="form-input">
                                <Input placeholder="..."/>
                            </Form.Item>
                        </Col>
                    </Row> : null}
                    {/* 4 - qator*/}
                    <Row>
                        <Col xs={24} md={8}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.CATEGORY}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.SUB_CATEGORY}:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.THEME}:</i>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={8}>
                            <Form.Item name="category_id" className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <Select showSearch
                                        optionFilterProp="children"
                                        style={{width: '100%'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                        onSelect={getSubCategoryList}>
                                    {categoryList.map(category => <Option key={category.id}
                                                                          value={category.id}>{category.nameUz}</Option>)};>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="sub_category_id" className="form-input">
                                <Select showSearch
                                        optionFilterProp="children"
                                        style={{width: '100%'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                        onSelect={getThemeList}>
                                    {subCategoryList.map(subCategory => <Option key={subCategory.id}
                                                                                value={subCategory.id}>{subCategory.nameUz}</Option>)};>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="theme_id" className="form-input">
                                <Select showSearch
                                        optionFilterProp="children"
                                        style={{width: '100%'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                        onSelect={id => setThemeId(id)}>
                                    {themeList.map(theme => <Option key={theme.id}
                                                                    value={theme.id}>{theme.nameUz}</Option>)};>

                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* 6 - qator*/}
                    <Row>
                        <Col xs={24} md={24}>
                            <div style={{
                                textAlign: "left",
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 10,
                                borderBottom: '1px solid black'
                            }}>
                                <i style={{
                                    fontStyle: "normal",
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }}>{textConstants.RESPONSIVE_PERSON}: &nbsp;
                                    {responsiblePerson.responsivePersonName == null ?
                                        <i style={{color: "green"}}>"автоматически генерируется при выборе
                                            категорий"</i> : responsiblePerson.departmentName + " " + responsiblePerson.responsivePersonName + ", " + "тел: " + responsiblePerson.phoneNumber}
                                </i>
                            </div>
                        </Col>
                    </Row>
                    {/* 7 - qator*/}
                    <br/>
                    <Row>
                        <Col xs={24} md={8}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.APPLICATION_RESULT}<span
                                    style={{color: "red"}}>*</span>:</i>
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <div style={{textAlign: "left", marginLeft: 5, marginRight: 5}}>
                                <i style={{fontStyle: "normal"}}>{textConstants.COMMENTARY}:</i>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={8}>
                            <Form.Item name="result_id" className="form-input"
                                       rules={[{required: isRequired, message: "введите информацию!"}]}>
                                <Select showSearch
                                        optionFilterProp="children"
                                        style={{width: '100%'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear>
                                    {resultList.map(result => <Option key={result.id}
                                                                      value={result.id}>{result.nameUz}</Option>)};>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={16}>
                            <Form.Item name="note" className="form-input">
                                <Input placeholder="..."/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} style={{textAlign: "right", paddingRight: "5px"}}>
                            <Button htmlType="submit" type="primary">
                                {textConstants.BUTTON_SAVE}
                            </Button>
                            {/*&nbsp;*/}
                            {/*<Button key="back" onClick={closeFormWindow}>*/}
                            {/*    {textConstants.BUTTON_CANCEL}*/}
                            {/*</Button>*/}
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <ClientCallHistory clientCallHistoryModalVisible={clientCallHistoryModalVisible}
                               setClientCallHistoryModalVisible={setClientCallHistoryModalVisible} item={item.snum}/>
        </>
    );
}

const mapStateToProps = (state) => ({
    user_data: state.user.user_data,
    textConstants: state.user.textConstants
});

export default connect(
    mapStateToProps,
    {getUser}
)(Registration);