import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, TextField, Container, Paper } from '@material-ui/core';
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

  componentDidMount() {
    this.load(this.props.data.Id ? this.props.data.Id : this.props.data);
  }

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}
        <Container>
          <Paper elevation={2}>
            <Grid container direction='column' justify='center' alignItems='center'>
              <Grid item container direction='row' xs={12} spacing={2}>
                <Grid item xs={2}>
                  <TextField
                    type='text'
                    label='MDC-Number'
                    variant='outlined'
                    value={baseEntity.ControlNumber || ''}
                    onChange={event => this.handleInputChange(event, 'ControlNumber')}
                    style={{ textAlign: 'left' }}
                    margin='normal'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={2}>
                  <KeyboardDateTimePicker
                    clearable
                    label='Date Created At'
                    value={baseEntity.CreatedAt}
                    onChange={date => this.handleDateChange(date, 'CreatedAt')}
                    format='DD/MMMM/YYYY'
                    margin='dense'
                    fullWidth
                    // disabled={isDisabled}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={12} spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    type='text'
                    label='Process Type'
                    variant='outlined'
                    value={baseEntity.ProcessType || ''}
                    onChange={event => this.handleInputChange(event, 'ProcessType')}
                    style={{ textAlign: 'left' }}
                    margin='normal'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    type='text'
                    label='Document Tiltle'
                    variant='outlined'
                    value={baseEntity.DocumentTitle || ''}
                    onChange={event => this.handleInputChange(event, 'DocumentTitle')}
                    style={{ textAlign: 'left' }}
                    margin='normal'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    type='text'
                    label='Owner'
                    variant='outlined'
                    value={baseEntity.Owner || ''}
                    onChange={event => this.handleInputChange(event, 'Owner')}
                    style={{ textAlign: 'left' }}
                    margin='normal'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    type='text'
                    label='Department or Area'
                    variant='outlined'
                    value={baseEntity.DepartmentArea || ''}
                    onChange={event => this.handleInputChange(event, 'DepartmentArea')}
                    style={{ textAlign: 'left' }}
                    margin='normal'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' xs={12} spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type='text'
                    label='Comments'
                    multiline
                    variant='outlined'
                    value={baseEntity.Comments || ''}
                    onChange={event => this.handleInputChange(event, 'Comments')}
                    style={{ textAlign: 'left' }}
                    margin='normal'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(MDCForm) as any) as React.ComponentClass<MDCProps>;
