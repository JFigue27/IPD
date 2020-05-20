import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, TextField, Container, Paper, FormControlLabel, Switch } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

import MDCService from './mdc.service';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Approvers from '../Approver/approvers';
import MdcAttachmentFiles from '../MdcAttachmentFile/mdcAttachmentFiles';
import Autocomplete from '../../widgets/Autocomplete';

const service = new MDCService();
const defaultConfig = {
  service
};
import AccountService from '../Account/account.service';
const accountService = new AccountService();

const PType = ['Procedure', 'ITJ', 'Spec', 'WI', 'etc', 'etc2'];

interface MDCProps extends FormProps {}

class MDCForm extends FormContainer<MDCProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    this.load(this.props.data?.Id ? this.props.data.Id : {});

    accountService.LoadEntities().then(accounts => this.setState({ accounts }));
  }

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;
    const { accounts } = this.state as any;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}
        <Container maxWidth='lg'>
          <Grid container direction='column' justify='center' alignItems='center'>
            <Grid item container direction='row' spacing={2}>
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
            <Grid item container direction='row' spacing={2}>
              <Grid item xs={2} style={{ marginTop: 11 }}>
                <Autocomplete
                  flat
                  options={PType}
                  owner={baseEntity}
                  onChange={this.handleAutocomplete}
                  targetProp='ProcessType'
                  label='Process Type'
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
              <Grid item xs={3} style={{ marginTop: 11 }}>
                <Autocomplete
                  options={accounts}
                  displayValue='UserName'
                  fromProp='UserName'
                  owner={baseEntity}
                  onChange={this.handleAutocomplete}
                  targetProp='Owner'
                  label='Owner'
                />
              </Grid>
              <Grid item xs={2}>
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
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Switch
                      color='primary'
                      onChange={event => this.handleCheckBoxChange(event, 'isNeedTraining')}
                      checked={baseEntity.isNeedTraining == 1}
                      value={baseEntity.isNeedTraining}
                    />
                  }
                  label='Need Training?'
                  labelPlacement='top'
                  // disabled={isDisabled}
                />
              </Grid>
            </Grid>
            <Grid item container direction='row' spacing={2}>
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
            {/* <Grid container>
              <Grid item xs={6}>
                {baseEntity.Id > 0 && <Approvers mdc={baseEntity} />}
              </Grid>
              <Grid item xs={6}>
                {baseEntity.Id > 0 && <MdcAttachmentFiles mdc={baseEntity} />}
              </Grid>
            </Grid> */}
            <Grid container>
              {baseEntity.Id > 0 && <MdcAttachmentFiles mdc={baseEntity} />}
              {baseEntity.Id > 0 && <Approvers mdc={baseEntity} />}
            </Grid>

            {/* <pre>{JSON.stringify(baseEntity, null, 3)}</pre> */}
          </Grid>
        </Container>
        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(MDCForm) as any) as React.ComponentClass<MDCProps>;
