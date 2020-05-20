import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

///start:generated:dependencies<<<
import { TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

import ApproverService from './approver.service';

const service = new ApproverService();
const defaultConfig = {
  service
};

interface ApproverProps extends FormProps {
  MDCId?: any;
}

class ApproverForm extends FormContainer<ApproverProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<
    this.setState({ isDisabled: false });
    this.load(this.props.data.Id ? this.props.data.Id : this.props.data);
    ///end:slot:load<<<
  }

  AFTER_LOAD = instance => {
    ///start:slot:afterload<<<
    this.setState({ isDisabled: false });
    ///end:slot:afterload<<<
  };

  AFTER_CREATE = instance => {};

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container className='sm' maxWidth='sm'>
          <TextField
            type='text'
            label='Approver Name'
            value={baseEntity.ApproverName || ''}
            onChange={event => this.handleInputChange(event, 'ApproverName')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
            InputProps={{
              readOnly: false
            }}
          />

          <TextField
            type='text'
            label='Department Area'
            value={baseEntity.DepartmentArea || ''}
            onChange={event => this.handleInputChange(event, 'DepartmentArea')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
            InputProps={{
              readOnly: false
            }}
          />

          <TextField
            type='text'
            label='Approval Status'
            value={baseEntity.ApprovalStatus || ''}
            onChange={event => this.handleInputChange(event, 'ApprovalStatus')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
            InputProps={{
              readOnly: false
            }}
          />

          <TextField
            type='text'
            label='Approval Comments'
            value={baseEntity.ApprovalComments || ''}
            onChange={event => this.handleInputChange(event, 'ApprovalComments')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
            InputProps={{
              readOnly: false
            }}
          />

          <KeyboardDatePicker
            clearable
            label='Deadline'
            value={baseEntity.ConvertedDeadline}
            onChange={date => this.handleDateChange(date, 'ConvertedDeadline')}
            format='MMM/DD/YYYY'
            margin='dense'
            fullWidth
            disabled={isDisabled}
          />

          {/* <pre>{JSON.stringify(baseEntity, null, 3)}</pre> */}
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(ApproverForm) as any) as React.ComponentClass<ApproverProps>;
