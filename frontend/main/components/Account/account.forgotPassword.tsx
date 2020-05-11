import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, Paper, TextField, Button, Icon } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

///start:generated:dependencies<<<
import Dialog from '../../widgets/Dialog';
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

import AccountService from './account.service';
import AppConfig from '../../core/AppConfig';

const service = new AccountService();
const defaultConfig = {
  service
};

const Request = async (method: string, endpoint: string, data: any, BaseURL?: string) => {
  const config: RequestInit = {
    method: method,
    mode: 'cors',
    // cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: null
  };
  if (['POST', 'PUT', 'DELETE'].includes(method)) config.body = JSON.stringify(data);
  let response = await fetch((BaseURL || AppConfig.BaseURL) + endpoint, config);
  if (response) {
    if (!response.ok) throw await response.json();
    if (response.status == 403) alert('Invalid Role.');
    if (response.status == 401) throw response;
  } else {
    alert('Failed to fetch. Probably server is down.');
  }
  try {
    const result = await response.json();
    return result;
  } catch (e) {
    return null;
  }
};

interface AccountProps extends FormProps {}

class AccountForm extends FormContainer<AccountProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<
    this.openDialog('forgot-password', {});

    ///end:slot:load<<<
  }

  handleSubmit = event => {
    event.preventDefault();
    Request('POST', 'Account/EmailForgotPassword', this.state.baseEntity).then(() => {
      console.log('Done');
      this.navigateTo('/afterforgot-password');
    });

    console.log('test');
  };

  render() {
    const { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Dialog opener={this} id='forgot-password' fullScreen actionsOff okLabel=''>
          {dialog => (
            <Container style={{ paddingTop: '5%' }} maxWidth='md'>
              <Paper elevation={5}>
                <img src='./static/images/' style={{ width: '40%', margin: '5%' }} />
                <form onSubmit={this.handleSubmit}>
                  <Grid item container direction='column' alignItems='center' justify='center' spacing={2} xs={12} sm>
                    <Grid item xs>
                      <Typography align='center' variant='h6'>
                        ¿Olvidaste tu contraseña?
                      </Typography>
                      <Typography align='center' variant='h6'>
                        Favor de ingresar el nombre de usuario o correo electrónico registrado.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm>
                      <TextField
                        type='text'
                        label='Usuario | Correo eléctronico'
                        value={baseEntity.UserName || ''}
                        variant='outlined'
                        onChange={event => this.handleInputChange(event, 'UserName')}
                        style={{ width: '115%' }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography align='center' variant='subtitle2'>
                        Te enviaremos un enlace a tu correo para que puedas cambiar la contraseña.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm>
                      <Button type='submit' variant='contained' color='primary' endIcon={<Icon>send</Icon>} style={{ margin: '15%' }}>
                        Enviar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Container>
          )}
        </Dialog>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(AccountForm) as any) as React.ComponentClass<AccountProps>;
