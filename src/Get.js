import React from 'react'
import {GetForm} from './GetForm'
import GeneralLayout from './GeneralLayout'

export default class Get extends React.Component {
    render() {
        return (
            <GeneralLayout title={'Get'} history={this.props.history}>
                <GetForm />
            </GeneralLayout>
        )
    }
}
