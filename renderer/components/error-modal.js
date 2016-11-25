import { Button, Header, Icon, Modal} from 'semantic-ui-react'
import React, { Component } from 'react'

export default class ErrorModal extends Component {
	state = {
		modalOpen: false
	}

	handleOpen = (e) => this.setState({
		modalOpen: true
	})

	handleClose = (e) => this.setState({
		modalOpen: false
	})

	render() {
		return (
		<Modal open={ this.state.modalOpen } onClose={ this.handleClose } basic size='small'>
			<Header icon='warning' content='Error' />
			<Modal.Content>
				<h3>One or more files are unreadable</h3>
			</Modal.Content>
			<Modal.Actions>
				<Button color='green' onClick={ this.handleClose } inverted>
				<Icon name='checkmark' /> Got it
				</Button>
			</Modal.Actions>
		</Modal>
		)
	}
}