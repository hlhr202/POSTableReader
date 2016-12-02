import React, { Component } from 'react'
import { render } from 'react-dom'
import { Divider, Header, Form, Input, Button, Icon, Menu, Segment, Container } from 'semantic-ui-react'
import ErrorModal from './components/error-modal'
import { ipcRenderer, dialog } from 'electron'
import moment from 'moment'
const ipc = ipcRenderer



class App extends Component {
	state = {
		config: {},
		count: 0,
		outputString: '',
		data: {},
		loaded: false
	}
	componentWillMount() {
		this.initIpc()
	}
	initIpc = () => {
		ipc.send('get-config')
		ipc.on('get-config', function(event, config) {
			self.setState({
				config: config
			})
			self.setState({
				count: config['tran_file_no']
			})
		})
		var self = this;
		ipc.on('open-file-dialog', function(event, response) {
			if (response.error) {
				self.refs.errorModal.handleOpen()
			} else {
				let summery = response.summery
				let data = self.getData(summery)
				self.setState({
					data: data
				})
				self.setState({
					loaded: true
				})
				self.computeString()
			}
		})
	}

	getData = (summery) => {
		let data = {}
		console.log(this.state)
		data['tenant_id'] = this.state.config['tenant_id']
		data['pos_no'] = this.state.config['pos_no']
		data['sale_date'] = summery['date']
		data['tran_file_no'] = this.state.count
		data['open_receipt'] = summery['head']
		data['close_receipt'] = summery['tail']
		data['total_receipt'] = summery['count']
		data['gross_sales'] = summery['total']
		data['tax'] = summery['tax']
		data['net_sales'] = summery['total']
		return data;
	}

	computeString = () => {
		let data = this.state.data
		data['tran_file_no'] = this.state.count
		this.setState({
			data: data
		})
		let s = data['tenant_id'] + '|' + data['pos_no'] + '|' + data['sale_date'] + '|' + data['tran_file_no'] + '|' + data['open_receipt'] + '|' + data['close_receipt'] + '|' + data['total_receipt'] + '|' + data['gross_sales'] + '|' + data['tax'] + '|' + '|'+ '|' + '|' + '|' + '|' + data['net_sales']
		this.setState({
			outputString: s
		})
	}

	chooseFileClick = (e) => {
		ipc.send('open-file-dialog')
	}

	saveFileClick = (e) => {
		let data = this.state.data
		let namePattern = data['tenant_id'] + '_' + data['pos_no'] + '_' + data['tran_file_no'] + '_' + moment().format('YYMMDDhhmm') + '.txt'
		let fileNo = data['tran_file_no']
		ipc.send('open-save-dialog', {
			outputString: this.state.outputString,
			namePattern: namePattern,
			fileNo: fileNo
		})
	}

	handleCountChange = (event) => {
		this.setState({
			count: event.target.value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault()
	}
	render() {
		const {loaded, count, config, outputString} = this.state
		return (
			<Container fluid>
				<Container as='div' id='header-container' textAlign='center'>
					<Header as='h2' icon>
						<Icon name='file excel outline' /> POS Table Reader
						<Header.Subheader>
							TENANT ID: { config['tenant_id'] ? config['tenant_id'] : null } Pos Number: { config['pos_no'] ? config['pos_no'] : null
							} Current File Count: { config['tran_file_no'] ? config['tran_file_no'] : null }
						</Header.Subheader>
					</Header>
				</Container>
				<Divider/>
				<Container textAlign='center'>
					<Form onSubmit={ this.handleSubmit }>
						<Form.Group widths='equal'>
							<Form.Field label='Daily File Count' name='count' control={ Input } value={ count } onChange={ this.handleCountChange } placeholder='Daily File Count'
							/>
						</Form.Group>
						<Form.Group>
							<Form.Field control={ Button } primary onClick={ this.chooseFileClick }>Choose File</Form.Field>
							<Form.Field control={ Button } disabled={ !loaded } primary onClick={ this.computeString }>Preview</Form.Field>
							<Form.Field control={ Button } disabled={ !loaded } primary onClick={ this.saveFileClick }>Save</Form.Field>
						</Form.Group>
					</Form>
				</Container>
				<Divider/>
				<Container textAlign='center'>
					<Header as='h5'>Preview Your Data</Header>
					{ outputString ? outputString : null }
				</Container>
				<ErrorModal ref="errorModal" />
			</Container>
		)
	}
}

render(
	<App/>, document.getElementById('app'));