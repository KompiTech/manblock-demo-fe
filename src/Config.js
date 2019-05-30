import React from 'react'
import {Empty, List, notification, Skeleton} from 'antd'
import request from 'superagent'
import GeneralLayout from './GeneralLayout'

export default class Config extends React.Component {
    state = {
        loading: true,
        data: undefined,
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
            <GeneralLayout title={'Config'} history={this.props.history}>
                {this.state.loading ? (
                    <Skeleton />
                ) : this.state.data ? (
                    <div>
                        <h3>Organization : {this.state.data.organization}</h3>
                        <h3>Channels</h3>
                        <List
                            footer={null}
                            bordered
                            dataSource={this.state.data.channels}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                        <h3>Orderers</h3>
                        <List
                            footer={null}
                            bordered
                            dataSource={this.state.data.orderers}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                        <h3>Peers</h3>
                        <List
                            footer={null}
                            bordered
                            dataSource={this.state.data.peers}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                        <h3>Users</h3>
                        <List
                            footer={null}
                            bordered
                            dataSource={this.state.data.users}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </GeneralLayout>
        )
    }
}
