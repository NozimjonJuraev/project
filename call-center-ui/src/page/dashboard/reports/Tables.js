import {Col, Row} from "antd";
import TableByTerritoriesByQuestion from "./tables/TableByTerritoriesByQuestion";
import TableByCategoryByQuestion from "./tables/TableByCategoryByQuestion";
import TableByTinTypeByQuestion from "./tables/TableByTinTypeByQuestion";

function Tables() {
    return (
        <>
            <Row>
                <Col xs={24} md={24} style={{display: "flex", justifyContent: "flex-start"}}>
                    <Col xs={24} md={24}>
                        <TableByTerritoriesByQuestion/>
                    </Col>
                </Col>
                <Col xs={24} md={24} style={{display: "flex", justifyContent: "flex-start", marginTop: 20}}>
                    <Col xs={24} md={24}>
                        <TableByCategoryByQuestion/>
                    </Col>
                </Col>
                <Col xs={24} md={24} style={{display: "flex", justifyContent: "flex-start", marginTop: 20}}>
                    <Col xs={24} md={24}>
                        <TableByTinTypeByQuestion/>
                    </Col>
                </Col>
            </Row>
        </>
    );
}

export default Tables;