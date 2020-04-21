import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

import { Container } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { FormControlLabel, Checkbox } from '@material-ui/core';

import AccountService from './account.service';

const service = new AccountService();
const defaultConfig = {
  service
};

interface AccountProps extends FormProps {}

class AccountForm extends FormContainer<AccountProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    this.load(this.props.data);
  }

  AFTER_LOAD = entity => {
    this.setState({ isDisabled: false });
  };

  AFTER_CREATE = instance => {};

  render() {
    const { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        <Container style={{ padding: 20 }} maxWidth={false}>
          <TextField
            type='text'
            label='User Name'
            value={baseEntity.UserName || ''}
            onChange={event => this.handleInputChange(event, 'UserName')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            type='text'
            label='Display Name'
            value={baseEntity.DisplayName || ''}
            onChange={event => this.handleInputChange(event, 'DisplayName')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            type='email'
            label='Email'
            value={baseEntity.Email || ''}
            onChange={event => this.handleInputChange(event, 'Email')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            type='text'
            label='Phone Number'
            value={baseEntity.PhoneNumber || ''}
            onChange={event => this.handleInputChange(event, 'PhoneNumber')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            type='text'
            label='Roles (CSV)'
            value={baseEntity.CSVRoles || ''}
            onChange={event => this.handleInputChange(event, 'CSVRoles')}
            style={{ textAlign: 'left' }}
            margin='dense'
            disabled={isDisabled}
            fullWidth
          />
          <Paper elevation={5} style={{ padding: 20, marginTop: 20 }}>
            {!!baseEntity.Id && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      color='primary'
                      onChange={event => this.handleCheckBoxChange(event, 'UpdatePassword')}
                      checked={baseEntity.UpdatePassword == 1}
                      value={baseEntity.UpdatePassword}
                    />
                  }
                  label='Update Password'
                  labelPlacement='end'
                  disabled={isDisabled}
                />
              </>
            )}
            {(!baseEntity.Id || baseEntity.UpdatePassword) && (
              <>
                <TextField
                  type='password'
                  label='Password'
                  value={baseEntity.Password || ''}
                  onChange={event => this.handleInputChange(event, 'Password')}
                  style={{ textAlign: 'left' }}
                  margin='dense'
                  disabled={isDisabled}
                  fullWidth
                />
                <TextField
                  type='password'
                  label='Confirm Password'
                  value={baseEntity.ConfirmPassword || ''}
                  onChange={event => this.handleInputChange(event, 'ConfirmPassword')}
                  style={{ textAlign: 'left' }}
                  margin='dense'
                  disabled={isDisabled}
                  fullWidth
                />
              </>
            )}
          </Paper>
        </Container>
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(AccountForm) as any) as React.ComponentClass<AccountProps>;
