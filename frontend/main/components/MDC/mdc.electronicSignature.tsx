import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, Button, Icon, Paper, TextField, InputAdornment, IconButton } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

///start:generated:dependencies<<<
import Dialog from '../../widgets/Dialog';
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

import MDCService from './mdc.service';

const service = new MDCService();
const defaultConfig = {
  service
};

interface AccountProps extends FormProps {
  ElectSign?: any;
}

class AccountForm extends FormContainer<AccountProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<
    // this.load(this.props.data.Id ? this.props.data.Id : this.props.data);
    ///end:slot:load<<<

    console.log(this.props.ElectSign);
    this.setState({ baseEntity: this.props.ElectSign });
  }

  AFTER_LOAD = entity => {
    ///start:slot:afterload<<<
    this.setState({ isDisabled: false });
    // this.setState({ baseEntity: this.props.ElectSign });
    ///end:slot:afterload<<<
  };

  handleClickShowPassword = () => {
    this.toggle('showPassword');
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state.baseEntity);
    this.service
      .Post('ChangeStatus', this.state.baseEntity)
      .then(() => {
        console.log('Test - Mdc/ChangeStatus');
      })
      .catch(e =>
        this.setState({
          sesionError: e
        })
      );
  };

  render() {
    let { isLoading, isDisabled, baseEntity, showPassword } = this.state as any;

    console.log(baseEntity);

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container maxWidth={false}>
          <Grid item container direction='column' justify='center' spacing={2} alignItems='baseline' xs={12} sm>
            <Grid container item direction='row' justify='flex-end' alignItems='baseline'>
              <Grid item xs={12} sm>
                <Typography align='right'>
                  <img src='/static/images/Molex_Red.png' alt='Logo Molex' style={{ width: 100 }} />
                </Typography>
                <Typography align='center' variant='h6'>
                  Are you sure wants to approved this document(s)?
                </Typography>
              </Grid>
            </Grid>
            {baseEntity && (
              <Grid container item direction='row' justify='flex-end' alignItems='baseline'>
                <Grid item xs={12} sm>
                  <Typography variant='subtitle2'>MDC-Number</Typography>
                  <Typography>{baseEntity.ControlNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm>
                  <Typography variant='subtitle2'>Process Type</Typography>
                  <Typography>{baseEntity.ProcessType}</Typography>
                </Grid>
                <Grid item xs={12} sm>
                  <Typography variant='subtitle2'>Document Status</Typography>
                  <Typography>{baseEntity.DocumentStatus}</Typography>
                </Grid>
              </Grid>
            )}
            <Grid container item direction='row' justify='center' alignItems='baseline'>
              <form onSubmit={this.handleSubmit}>
                <Grid item xs={12} sm>
                  <Typography align='center' variant='h6'>
                    Please send this MDC #{baseEntity.ControlNumber} to review state.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm>
                  {/* <TextField
                    type={showPassword ? 'text' : 'password'}
                    label='Password'
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
                  /> */}
                </Grid>
                <Grid item xs={12} sm>
                  <Typography align='center'>
                    <Button type='submit' className='fab' variant='contained' color='primary' size='small' endIcon={<Icon>send</Icon>}>
                      Send
                    </Button>
                  </Typography>
                </Grid>
              </form>
            </Grid>
            {/* <Grid container item direction='row' justify='center' alignItems='baseline'>
              <Typography align='center'>
                <Button
                  className='fab'
                  color='primary'
                  endIcon={<Icon>send</Icon>}
                  variant='contained'
                  size='small'
                  onClick={event => {
                    event.stopPropagation();
                  }}
                >
                  Send
                </Button>
              </Typography>
            </Grid> */}
          </Grid>
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(AccountForm) as any) as React.ComponentClass<AccountProps>;
