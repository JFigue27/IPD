import React from 'react';
import { withRouter } from 'next/router';
import {
  NoSsr,
  Typography,
  Grid,
  TextField,
  Container,
  Paper,
  FormControlLabel,
  Switch,
  Button,
  Stepper,
  Step,
  StepLabel,
  Icon
} from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

import MDCService from './mdc.service';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Approvers from '../Approver/approvers';
import MdcAttachmentFiles from '../MdcAttachmentFile/mdcAttachmentFiles';
import Autocomplete from '../../widgets/Autocomplete';

import UniversalCatalogService from '../Catalog/universal.catalog.service';
import ElectronicSignature from './mdc.electronicSignature'

const universalCatalogService = new UniversalCatalogService();

const service = new MDCService();
const defaultConfig = {
  service
};
import AccountService from '../Account/account.service';
import Dialog from '../../widgets/Dialog';
const accountService = new AccountService();

const PType = ['Procedure', 'ITJ', 'Spec', 'WI', 'etc', 'etc2'];
const steps = ['Create', 'Review', 'Approved', 'Release', 'Obsolete'];

interface MDCProps extends FormProps {
  Mdc?: any;
}

class MDCForm extends FormContainer<MDCProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    this.load(this.props.data?.Id ? this.props.data.Id : { DocumentStatus: 'Create', ApprovalStatus: 0 });

    accountService.LoadEntities().then(accounts => this.setState({ accounts }));
    universalCatalogService.GetCatalog('Area').then(areas => {
      this.setState({
        areas
      });
    });
  }

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;
    const { accounts, areas } = this.state as any;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container maxWidth='xl'>
          <Grid container direction='column' justify='center' alignItems='center'>
            <Grid item container direction='row' spacing={2}>
              <Grid item xs>
                <Typography variant='h4' align='center'>
                  MDC
                </Typography>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={8} xl={10}>
                <Stepper activeStep={baseEntity.ApprovalStatus} alternativeLabel>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {/* <Stepper activeStepStatus={baseEntity.ApprovalStatus} /> */}
              </Grid>
              <Grid item xs>
                <img src='/static/images/Molex_Red.png' alt='Logo Molex' style={{ width: 120, margin: 5 }} />
              </Grid>
            </Grid>
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
              <Grid item xs={2}></Grid>
              <Grid item xs={6}>
                <Typography align='center'>
                  <Button
                    variant='contained'
                    color='primary'
                    endIcon={<Icon>send</Icon>}
                    style={{ margin: 10 }}
                    onClick={event => {
                      event.stopPropagation();
                      this.openDialog('electronic-signature', event);
                    }}
                  >
                    Send MDC # {baseEntity.ControlNumber} to Approved State
                  </Button>
                </Typography>
              </Grid>
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
                {/* // Todo: See error in console! */}
                <Autocomplete
                  flat
                  options={PType.map(o => o)}
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
              <Grid item xs={2} style={{ marginTop: 11 }}>
                <Autocomplete
                  options={areas}
                  displayValue='Value'
                  fromProp='Value'
                  owner={baseEntity}
                  onChange={this.handleAutocomplete}
                  targetProp='DepartmentArea'
                  label='Department or Area'
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
              {/* {baseEntity.DocumentStatus} | {baseEntity.ApprovalStatus} | {baseEntity.isNeedTraining} */}
              {/* <pre>{baseEntity.isNeedTraining}</pre>
              <pre>{JSON.stringify(baseEntity, null, 3)}</pre> */}
              {baseEntity.Id > 0 && <MdcAttachmentFiles mdc={baseEntity} />}
              {baseEntity.Id > 0 && <Approvers mdc={baseEntity} />}
            </Grid>

            {/* <pre>{JSON.stringify(baseEntity, null, 3)}</pre> */}
          </Grid>
        </Container>
        <Dialog opener={this} id='electronic-signature' okLabel='' maxWidth='md' dividersOff actionsOff>
          {dialog => <ElectronicSignature dialog={dialog} data={(this.state as any)['electronic-signature']} ElectSign={baseEntity} />}
        </Dialog>
        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(MDCForm) as any) as React.ComponentClass<MDCProps>;
