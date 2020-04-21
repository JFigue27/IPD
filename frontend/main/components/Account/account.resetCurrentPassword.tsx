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
  InputAdornment,
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
  service,
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
    ///end:slot:load<<<
  }

  handleSubmit = event => {
    event.preventDefault();

    this.state.baseEntity.Token = this.getParameterByName('token');
    // console.log(this.state.baseEntity);

    if (this.state.baseEntity.Password === this.state.baseEntity.ConfirmPassword) {
      this.service
        .Post('ResetCurrentPassword', this.state.baseEntity)
        .then(() => {
          this.navigateTo('/');
          console.log('Done');
        })
        .catch(e =>
          this.setState({
            sesionError: e,
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
        <Container style={{ paddingTop: '5%' }} maxWidth='md'>
          <form onSubmit={this.handleSubmit}>
            <Grid item container direction='column' alignItems='center' justify='center' spacing={2} xs={12} sm>
              <Grid item xs={12} sm>
                <Typography align='center'>
                  <img src='./static/images/siafracc-fondosclaros.png' style={{ width: '68%', margin: '2%' }} />
                </Typography>
              </Grid>
              <Grid item xs={12} sm>
                <Typography align='center' variant='h5'>
                  Favor de ingresar su nueva contraseña.
                </Typography>
              </Grid>
              <Grid item xs={12} sm>
                <TextField
                  type='password'
                  required
                  label='Contraseña Actual'
                  error={sesionError || false}
                  value={baseEntity.CurrentPassword || ''}
                  onChange={event => this.handleInputChange(event, 'CurrentPassword')}
                  style={{ textAlign: 'left' }}
                  margin='normal'
                  // disabled={isDisabled}
                  variant='outlined'
                  fullWidth
                />
                {sesionError && (
                  <Grid item xs={12} sm>
                    <Typography align='left' variant='subtitle2' style={{ color: '#ff0000c7' }}>
                      Contraseña Actual Incorrecta.
                    </Typography>
                  </Grid>
                )}
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  required
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
                    ),
                  }}
                />
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  required
                  label='Confirmar Contraseña'
                  error={passwordError || false}
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
            </Grid>
          </form>
        </Container>
        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(AccountForm) as any) as React.ComponentClass<AccountProps>;
