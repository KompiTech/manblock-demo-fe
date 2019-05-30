import React from "react";
import { Button, Form, Input, notification, Row, Select, Table, Tag } from "antd";
import request from "superagent";

const {Option} = Select

class _GetForm extends React.Component {
    state = {
        loading: false,
        data: undefined,
        channels: [],
        users: [],
        organization: null,
        loadingConf: true,
        channel: undefined,
        user: undefined,
        chaincode: undefined,
        loadingSign: false,
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loading: true})
                localStorage.setItem('chaincode', values.chaincode)
                if (this.props.send) {
                    request
                      .post(
                        window.env.BASE_URL +
                        window.env.PORT +
                        '/api/v1/chaincode/invoke'
                      )
                      .query({chaincode: values.chaincode})
                      .query({user: values.user})
                      .query({channel: values.channel})
                      .query({args: JSON.stringify({hash: values.data, signed: false})})
                      .query({fcn: 'put'})
                      .then(() => {
                          this.setState({
                              loading: false,
                          })
                          this.props.form.resetFields()
                          notification.success({message: 'Success'})
                      })
                      .catch(err => {
                          this.setState({loading: false})
                          console.error(err)
                          notification.error({message: 'Error'})
                      })
                } else {
                    request
                      .get(
                        window.env.BASE_URL +
                        window.env.PORT +
                        '/api/v1/chaincode/query'
                      )
                      .query({chaincode: values.chaincode})
                      .query({user: values.user})
                      .query({channel: values.channel})
                      .query({fcn: 'list'})
                      .then(res => {
                          const data = res.body,
                            newArray = []
                          for (let propName in data) {
                              if (data.hasOwnProperty(propName)) {
                                  newArray.push({
                                      id: propName,
                                      ...JSON.parse(data[propName]),
                                  })
                              }
                          }
                          // this.props.form.resetFields()
                          this.setState({
                              loading: false,
                              data: newArray,
                              channel: values.channel,
                              user: values.user,
                              chaincode: values.chaincode,
                          })
                      })
                      .catch(err => {
                          console.error(err)
                          this.setState({loading: false})
                          notification.error({message: 'Error'})
                      })
                }
            }
        })
    }

    getColumns() {
        return [
            {
                title: 'Name',
                dataIndex: 'hash',
            },
            {
                title: 'Sign',
                dataIndex: 'signed',
                render: (text, record) => (
                  <span>
                        {text ? (
                          <Tag color={'green'}>Signed</Tag>
                        ) : (
                          <Button loading={this.state.loadingSign} onClick={() => this.sign(record)}>
                              Sign
                          </Button>
                        )}
                    </span>
                ),
            },
        ]
    }

    sign(record) {
        this.setState({loadingSign: true})
        request
          .post(
            window.env.BASE_URL +
            window.env.PORT +
            '/api/v1/chaincode/invoke'
          )
          .query({chaincode: this.state.chaincode})
          .query({user: this.state.user})
          .query({channel: this.state.channel})
          .query({fcn: 'update'})
          .query({args: record.id})
          .query({args: JSON.stringify({hash: record.hash, signed: true})})
          .then(() => {
              this.setState({loadingSign: false})
              record.signed = true
              this.props.form.resetFields()
              notification.success({message: 'Success'})
          })
          .catch(err => {
              this.setState({loading: false})
              console.error(err)
              notification.error({message: 'Error'})
          })
    }

    componentDidMount() {
        request
          .get(window.env.BASE_URL + window.env.PORT + '/api/v1/config')
          .then(res => {
              if (res.body)
                  this.setState({
                      loadingConf: false,
                      channels: res.body.channels,
                      users: res.body.users,
                      organization: res.body.organization,
                  })
          })
          .catch(err => {
              console.error(err)
              this.setState({loadingConf: false})
              notification.error({message: 'Error'})
          })
    }

    render() {
        const {getFieldDecorator} = this.props.form

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 24},
                md: {span: 4},
                lg: {span: 4},
                xl: {span: 4},
                xxl: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 24},
                md: {span: 18},
                lg: {span: 18},
                xl: {span: 18},
                xxl: {span: 18},
            },
        }
        const buttonItemLayout = {
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 24},
                md: {span: 4, offset: 4},
                lg: {span: 4, offset: 4},
                xl: {span: 4, offset: 4},
                xxl: {span: 4, offset: 4},
            },
        }

        const chaincode = localStorage.getItem('chaincode')

        return (
          <div>
              <h3>Organization: {this.state.organization}</h3>
              <Row>
                  <Form layout={'horizontal'} labelAlign={'left'}>
                      <Form.Item label="Chaincode" {...formItemLayout}>
                          {getFieldDecorator('chaincode', {
                              rules: [
                                  {
                                      required: true,
                                      message: 'Please input chaincode!',
                                  },
                              ],
                              initialValue: chaincode ? chaincode : '',
                          })(<Input />)}
                      </Form.Item>
                      <Form.Item label="User" {...formItemLayout}>
                          {getFieldDecorator('user', {
                              rules: [
                                  {
                                      required: true,
                                      message: 'Please input user!',
                                  },
                              ],
                              initialValue: this.state.users[0],
                          })(
                            <Select loading={this.state.loadingConf}>
                                {this.state.users &&
                                this.state.users.map(elem => (
                                  <Option value={elem} key={elem}>
                                      {elem}
                                  </Option>
                                ))}
                            </Select>
                          )}
                      </Form.Item>
                      <Form.Item label="Channel" {...formItemLayout}>
                          {getFieldDecorator('channel', {
                              rules: [
                                  {
                                      required: true,
                                      message: 'Please input channel!',
                                  },
                              ],
                              initialValue: this.state.channels[0],
                          })(
                            <Select loading={this.state.loadingConf}>
                                {this.state.channels &&
                                this.state.channels.map(elem => (
                                  <Option value={elem} key={elem}>
                                      {elem}
                                  </Option>
                                ))}
                            </Select>
                          )}
                      </Form.Item>
                      {this.props.send && (
                        <Form.Item label="Hash" {...formItemLayout}>
                            {getFieldDecorator('data', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your data!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                      )}
                      <Form.Item {...buttonItemLayout}>
                          <Button
                            loading={this.state.loading}
                            type="primary"
                            onClick={this.handleSubmit}
                          >
                              {this.props.send ? 'Send' : 'Get'}
                          </Button>
                      </Form.Item>
                  </Form>
                  {this.state.data && (
                    <Row>
                        <Table
                          dataSource={this.state.data}
                          columns={this.getColumns()}
                          rowKey={'id'}
                        />
                    </Row>
                  )}
              </Row>
          </div>
        )
    }
}

export const GetForm = Form.create()(_GetForm)
