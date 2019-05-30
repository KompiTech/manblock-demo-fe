import React from 'react'
import {GetForm} from './GetForm'
import GeneralLayout from './GeneralLayout'

export default class Send extends React.Component {
    render() {
        return (
            <GeneralLayout title={'Send'} history={this.props.history}>
                <GetForm send={true} />
            </GeneralLayout>
        )
    }
}
