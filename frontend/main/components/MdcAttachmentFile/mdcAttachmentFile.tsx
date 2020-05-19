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

import MdcAttachmentFileService from './mdcattachmentfile.service';

const service = new MdcAttachmentFileService();
const defaultConfig = {
  service
};

interface MdcAttachmentFileProps extends FormProps {}

class MdcAttachmentFileForm extends FormContainer<MdcAttachmentFileProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<
    this.setState({ isDisabled: false });
    this.load(this.props.data.Id ? this.props.data.Id : this.props.data);

    ///end:slot:load<<<
  }

  AFTER_LOAD = entity => {
    ///start:slot:afterload<<<
    this.setState({ isDisabled: false });
    ///end:slot:afterload<<<
  };

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container className='sm' style={{ padding: 20 }} maxWidth='sm'>
          <TextField
            type='text'
            label='Mdc Attachment'
            value={baseEntity.MdcAttachment || ''}
            onChange={event => this.handleInputChange(event, 'MdcAttachment')}
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
            label='File Version'
            value={baseEntity.FileVersion || ''}
            onChange={event => this.handleInputChange(event, 'FileVersion')}
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
            label='Periodic Review'
            value={baseEntity.ConvertedPeriodicReview}
            onChange={date => this.handleDateChange(date, 'ConvertedPeriodicReview')}
            format='MMM/DD/YYYY'
            margin='dense'
            fullWidth
            disabled={isDisabled}
          />

          <KeyboardDatePicker
            clearable
            label='Release Date'
            value={baseEntity.ConvertedReleaseDate}
            onChange={date => this.handleDateChange(date, 'ConvertedReleaseDate')}
            format='MMM/DD/YYYY'
            margin='dense'
            fullWidth
            disabled={isDisabled}
          />

          <TextField
            type='text'
            label='Approval File Status'
            value={baseEntity.ApprovalFileStatus || ''}
            onChange={event => this.handleInputChange(event, 'ApprovalFileStatus')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
            InputProps={{
              readOnly: false
            }}
          />
        </Container>
        <pre>{JSON.stringify(baseEntity, null, 3)}</pre>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(MdcAttachmentFileForm) as any) as React.ComponentClass<MdcAttachmentFileProps>;
