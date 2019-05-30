import React from 'react'
import {Button, Col, Row} from 'antd'
import {Link} from 'react-router-dom'
import GeneralLayout from "./GeneralLayout";


export default class Home extends React.Component {
  render() {
    return (
      <GeneralLayout>
        <Row type="flex" justify="space-around" align="middle">
          <Col>
            <h1>Select your action</h1>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Button>
                <Link to={'/send'}>Send</Link>
              </Button>
              <Button>
                <Link to={'/get'}>Get</Link>
              </Button>
            </div>
          </Col>
        </Row>
      </GeneralLayout>
    )
  }
}
