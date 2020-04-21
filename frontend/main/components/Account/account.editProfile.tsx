import React from 'react';
import { withRouter } from 'next/router';
import {
  NoSsr,
  Typography,
  Grid,
  TextField,
  Paper,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  IconButton,
  Icon
} from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';
import Avatar from '../../widgets/Avatar';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

///start:generated:dependencies<<<
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

import AccountService from './account.service';
import Dialog from '../../widgets/Dialog';
import ResetCurrentPasswd from '../Account/account.resetCurrentPassword';

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
    ///start:slot:load<<<
    this.setState({ isDisabled: false });

    ///end:slot:load<<<
  }

  handleSubmit = event => {
    event.preventDefault();

    this.state.baseEntity.Token = this.getParameterByName('token');
    // console.log(this.state.baseEntity);

    if (this.state.baseEntity.Password === this.state.baseEntity.ConfirmPassword) {
      this.setState({
        passwordError: 'No coinsiden las contraseñas'
      });
    }
  };

  refresh = () => {
    console.log('Edit Profile Refesh');
    let currentUser = this.context.auth.user;

    if (currentUser) {
      this.load(currentUser.UserId);
    } else {
      alert('No hay user');
    }
  };

  AFTER_LOAD = entity => {
    ///start:slot:afterload<<<
    this.setState({ isDisabled: false });
    ///end:slot:afterload<<<
  };

  AFTER_CREATE = instance => {
    this.openDialog('resetCurrPaswd', instance);
  };

  ON_OPEN_ITEM = item => {
    this.openDialog('resetCurrPaswd', item);
  };

  handleOpenDialog = event => {
    this.setState({
      resetCurrPaswd: event
    });
  };

  handleClickShowPassword = () => {
    this.toggle('showPassword');
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const { isLoading, isDisabled, baseEntity, passwordError, showPassword, resetCurrPaswd = {} } = this.state as any;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container style={{ padding: 20 }} maxWidth='lg' fixed>
          <Grid container direction='row' justify='center' alignItems='center' style={{ marginBottom: 10 }}>
            <Grid item xs={6}>
              <Typography variant='h5' align='center'>
                Editar Perfil
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button variant='contained' color='primary' fullWidth size='large' onClick={event => this.save()}>
                Guardar
              </Button>
            </Grid>
          </Grid>
          <Grid container direction='row' justify='center' spacing={1} alignItems='flex-start'>
            <Avatar owner={baseEntity} onChange={this.onAttachmentsChange} directUpload avatarStyle={{ width: 60, height: 60 }}></Avatar>
            <Grid item container direction='row' xs={12} sm={6}>
              <Grid item xs={12}>
                <TextField
                  type='text'
                  label='Nombre de Usuario'
                  variant='outlined'
                  value={baseEntity.UserName || ''}
                  onChange={event => this.handleInputChange(event, 'UserName')}
                  style={{ textAlign: 'left' }}
                  margin='normal'
                  disabled={true}
                  fullWidth
                />
                <TextField
                  type='text'
                  label='Nombre a Mostrar'
                  value={baseEntity.DisplayName || ''}
                  onChange={event => this.handleInputChange(event, 'DisplayName')}
                  style={{ textAlign: 'left' }}
                  margin='normal'
                  disabled={isDisabled}
                  variant='outlined'
                  fullWidth
                />
                <TextField
                  type='email'
                  label='Correo Electrónico'
                  value={baseEntity.Email || ''}
                  onChange={event => this.handleInputChange(event, 'Email')}
                  style={{ textAlign: 'left' }}
                  margin='normal'
                  disabled={isDisabled}
                  variant='outlined'
                  fullWidth
                />
                <TextField
                  type='text'
                  label='Numero de Telefono'
                  value={baseEntity.PhoneNumber || ''}
                  onChange={event => this.handleInputChange(event, 'PhoneNumber')}
                  style={{ textAlign: 'left' }}
                  margin='normal'
                  disabled={isDisabled}
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Paper elevation={5} style={{ padding: 20, marginTop: 20, width: '100%' }}>
                {!!baseEntity.Id && (
                  <>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={event => {
                        this.handleOpenDialog(event);
                      }}
                      fullWidth
                    >
                      <Icon>lock</Icon>
                      Actualizar Contraseña
                    </Button>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Dialog opener={this} id='resetCurrPaswd' maxWidth='sm'>
          {dialog => <ResetCurrentPasswd dialog={dialog} /* data={this.state.resetCurrPaswd} */ />}
        </Dialog>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(AccountForm) as any) as React.ComponentClass<AccountProps>;
