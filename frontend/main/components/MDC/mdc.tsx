import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, TextField } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

import MDCService from './mdc.service';
import { KeyboardDateTimePicker } from '@material-ui/pickers';

const service = new MDCService();
const defaultConfig = {
  service
};

interface MDCProps extends FormProps {}

class MDCForm extends FormContainer<MDCProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount () {
    this.load(this.props.data.Id ? this.props.data.Id : this.props.data)
  }

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;    

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Grid item container direction='row' justify='center' spacing={2} alignItems='baseline'>
          <Grid item xs={12} sm>
            <p>Fecha</p>
          </Grid>

          <Grid item container direction='column' xs={12} sm={7}>
            <KeyboardDateTimePicker
              clearable
              label=''
              value={baseEntity.CreatedAt}
              onChange={date => this.handleDateChange(date, 'CreatedAt')}
              format='DD/MMMM/YYYY'
              margin='dense'
              fullWidth
              // disabled={isDisabled}
            />
          </Grid>
          <Grid item xs={12} sm>
            <p>Document Title</p>
          </Grid>

          <Grid item container direction='column' xs={12} sm={7}>
            <TextField
              type='text'
              label='Document Title'
              variant='outlined'
              value={baseEntity.DocumentTitle || ''}
              onChange={event => this.handleInputChange(event, 'DocumentTitle')}
              style={{ textAlign: 'left' }}
              margin='normal'
              disabled={false}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(MDCForm) as any) as React.ComponentClass<MDCProps>;
