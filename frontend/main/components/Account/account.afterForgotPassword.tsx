import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, Paper, Button, Icon } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

///start:generated:dependencies<<<
import Dialog from '../../widgets/Dialog';
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

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
    ///start:slot:load<<<
    this.openDialog('afterForgot-password', {});

    ///end:slot:load<<<
  }

  render() {
    const { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Dialog opener={this} id='afterForgot-password' fullScreen actionsOff okLabel=''>
          {dialog => (
            <Container style={{ paddingTop: '5%' }} maxWidth='md'>
              <Paper elevation={10}>
                <img src='./static/images/' style={{ width: '45%', margin: '5%' }} />
                <Grid item container direction='column' justify='center' spacing={2} xs={12} sm>
                  <Grid item xs={12} sm>
                    <Typography align='center' variant='h6'>
                      <Icon style={{height: 20}}>mail</Icon> Favor de revisar enlace en correo electrónico para cambiar contraseña.
                    </Typography>
                    <Typography align='center'>
                      <Button href="/" variant='contained' color='primary' startIcon={<Icon>arrow_back</Icon>} style={{ margin: '5%' }}>
                        Regresar a inicio de sesión
                      </Button>
                    </Typography>
                  </Grid>
                </Grid>
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
