import React from 'react'
import {Card, Col, Layout, Menu, notification, Row} from 'antd'
import request from 'superagent'
import {Link} from 'react-router-dom'
import Logo from './Logo'

const {Header, Content, Footer} = Layout

export default class GeneralLayout extends React.Component {
    state = {
        loading: true,
        data: undefined,
        current: this.props.history
            ? this.props.history.location.pathname
            : '/',
    }

    componentDidMount() {
        request
            .get(window.env.BASE_URL + window.env.PORT + '/api/v1/config')
            .then(res => {
                this.setState({loading: false, data: res.body})
            })
            .catch(err => {
                console.error(err)
                this.setState({loading: false})
                notification.error({message: 'Error'})
            })
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Header
                    style={{
                        position: 'fixed',
                        zIndex: 1,
                        width: '100%',
                        background: '#fff',
                    }}
                >
                    <div>
                        <Link to={'/'}>
                            <div className="logo">
                                <Logo />
                            </div>
                        </Link>
                        <Menu
                            theme="light"
                            mode="horizontal"
                            selectedKeys={[this.state.current]}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="/send">
                                <Link to={'/send'}>Send</Link>
                            </Menu.Item>
                            <Menu.Item key="/get">
                                <Link to={'/get'}>Get</Link>
                            </Menu.Item>
                            <Menu.Item key="/config">
                                <Link to={'/config'}>Config</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                    <div className={'orgname'}>
                        <h3>{window.env.ORG_NAME}</h3>
                    </div>
                </Header>
                <Content style={{padding: '50px', marginTop: 64}}>
                    <Row>
                        <Col
                            xs={{span: 24}}
                            sm={{span: 24}}
                            md={{span: 15}}
                            lg={{span: 15}}
                            xl={{span: 15}}
                            xxl={{span: 15}}
                        >
                            <Card title={this.props.title}>
                                {this.props.children}
                            </Card>
                        </Col>
                    </Row>
                </Content>
                <Footer style={{textAlign: 'center'}}>For demo use only</Footer>
            </Layout>
        )
    }
}
