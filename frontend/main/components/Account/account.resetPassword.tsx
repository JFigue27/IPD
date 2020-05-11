import React from 'react';
import { withRouter } from 'next/router';
import {
  NoSsr,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Icon,
  ButtonBase,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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

interface AccountProps extends FormProps {
  showPassword?: boolean;
}

class AccountForm extends FormContainer<AccountProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<

    this.openDialog('reset-password', {});

    ///end:slot:load<<<
  }

  handleSubmit = event => {
    event.preventDefault();

    this.state.baseEntity.Token = this.getParameterByName('token');
    // console.log(this.state.baseEntity);

    if (this.state.baseEntity.Password === this.state.baseEntity.ConfirmPassword) {
      Request('POST', 'Account/EmailResetPassword', this.state.baseEntity)
        .then(() => {
          this.navigateTo('/');
          console.log('Done');
        })
        .catch(e =>
          this.setState({
            sesionError: e
          })
        );
    } else {
      this.setState({
        passwordError: 'No coinsiden las contraseñas',
      });
    }
  };

  handleClickShowPassword = () => {
    this.toggle('showPassword');
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const { isLoading, isDisabled, baseEntity, sesionError, passwordError, showPassword } = this.state as any;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}
        <Dialog opener={this} id='reset-password' fullScreen actionsOff okLabel=''>
          {dialog => (
            <Container style={{ paddingTop: '5%' }} maxWidth='md'>
              <Paper elevation={10}>
                <form onSubmit={this.handleSubmit}>
                  <Grid item container direction='column' alignItems='center' justify='center' spacing={2} xs={12} sm>
                    <Grid item xs={12} sm={8} md={8} lg={8}>
                      <Typography align='center'>
                        <img src='./static/images/' style={{ width: '68%', margin: '2%' }} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm>
                      <Typography align='center' variant='h5'>
                        Favor de ingresar su nueva contraseña.
                      </Typography>
                    </Grid>
                    <Grid item xs={10} sm={5} md={5} lg={5}>
                      <TextField
                        type={showPassword ? 'text' : 'password'}
                        label='Nueva Contraseña'
                        value={baseEntity.Password || ''}
                        onChange={event => this.handleInputChange(event, 'Password')}
                        style={{ textAlign: 'left' }}
                        variant='outlined'
                        margin='normal'
                        // disabled={isDisabled}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={this.handleClickShowPassword}
                                onMouseDown={this.handleMouseDownPassword}
                                edge='end'
                                tabIndex={-1}
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField
                        type={showPassword ? 'text' : 'password'}
                        label='Confirmar Contraseña'
                        error={passwordError}
                        helperText={passwordError}
                        value={baseEntity.ConfirmPassword || ''}
                        onChange={event => this.handleInputChange(event, 'ConfirmPassword')}
                        style={{ textAlign: 'left' }}
                        variant='outlined'
                        margin='normal'
                        // disabled={isDisabled}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm>
                      <Button type='submit' variant='contained' color='primary' endIcon={<Icon>send</Icon>} style={{ margin: '15%' }}>
                        Enviar
                      </Button>
                    </Grid>
                    {sesionError && (
                      <Grid item xs={10} sm={10} md={10} lg={10}>
                        <Button href='/forgot-password' variant='outlined' color='primary'>
                          <Typography align='center' variant='button' style={{ color: '#ff0000' }}>
                            Sesión Invalida... Favor de crear nueva sesión para restablecer contraseña.
                          </Typography>
                          {/* <Icon>contact_mail</Icon> */}
                        </Button>
                      </Grid>
                    )}
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
