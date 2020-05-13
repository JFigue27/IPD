import React from 'react';
import { withRouter } from 'next/router';
import { NoSsr, Typography, Grid, Box, Paper } from '@material-ui/core';
import FormContainer, { FormProps } from '../../core/FormContainer';
import { withSnackbar } from 'notistack';

///start:generated:dependencies<<<
import { Button } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import { Container } from '@material-ui/core';
///end:generated:dependencies<<<

import HomeService from './home.service';
import './home.module.scss';

const service = new HomeService();
const defaultConfig = {
  service
};

interface HomeProps extends FormProps {}

class HomeForm extends FormContainer<HomeProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  render() {
    let { isLoading, isDisabled, baseEntity } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container className='md' style={{ padding: 20 }} maxWidth='md'>
          <Grid item container direction='row' className='start' justify='center' spacing={2} alignItems='flex-start'>
            <Grid item container direction='column' xs={12} sm={8}>
              <Paper elevation={2} style={{ marginBottom: 25 }}>
                <Box component='span' m={5}>
                  <Typography align='center'>
                    <img src='/static/images/Molex_Red.png' alt='Logo Molex' style={{ width: 200 }} />
                  </Typography>
                </Box>
              </Paper>
              <Grid
                item
                container
                direction='row'
                className='space-between baseline MainHeader'
                justify='space-between'
                spacing={2}
                alignItems='baseline'
              >
                <Grid item xs={12} sm>
                  <Typography variant='h4' gutterBottom>
                    What do you need to do?
                  </Typography>
                </Grid>

                <Grid item container direction='column' className='text-right' xs={12} sm={4}>
                  <Button
                    className='outlined'
                    variant='outlined'
                    size='small'
                    onClick={event => {
                      event.stopPropagation();
                      this.navigateTo('/');
                    }}
                  >
                    Create New Document
                  </Button>
                </Grid>
              </Grid>

              <List component='nav' style={{ paddingTop: 0 }} className='app__home__list'>
                <ListItem button onClick={() => this.navigateTo('/mdc')}>
                  <ListItemText primary='Procedure' />
                </ListItem>

                <ListItem button onClick={() => this.navigateTo('/')}>
                  <ListItemText primary='ITJ' />
                </ListItem>

                <ListItem button onClick={() => this.navigateTo('/')}>
                  <ListItemText primary='Spec' />
                </ListItem>

                <ListItem button onClick={() => this.toggle('collapse')}>
                  <ListItemText primary='More Functions' />

                  {this.state['collapse'] ? <Icon>add_circle</Icon> : <Icon>remove_circle</Icon>}
                </ListItem>

                <Collapse in={(this.state as any)['collapse']} timeout='auto' unmountOnExit>
                  <List component='nav' style={{ paddingTop: 0 }}>
                    <ListItem button onClick={() => this.navigateTo('/')}>
                      <ListItemIcon>
                        <Icon>account_balance</Icon>
                      </ListItemIcon>
                      <ListItemText primary='Test 1' />
                    </ListItem>

                    <ListItem button onClick={() => this.navigateTo('/')}>
                      <ListItemIcon>
                        <Icon>thumb_up_alt</Icon>
                      </ListItemIcon>
                      <ListItemText primary='Test 2' />
                    </ListItem>

                    <ListItem button onClick={() => this.navigateTo('/')}>
                      <ListItemIcon>
                        <Icon>poll</Icon>
                      </ListItemIcon>
                      <ListItemText primary='Test 3' />
                    </ListItem>

                    <ListItem button onClick={() => this.navigateTo('/')}>
                      <ListItemIcon>
                        <Icon>insert_drive_file</Icon>
                      </ListItemIcon>
                      <ListItemText primary='Test 4' />
                    </ListItem>

                    <ListItem button onClick={() => this.navigateTo('/')}>
                      <ListItemIcon>
                        <Icon>notifications</Icon>
                      </ListItemIcon>
                      <ListItemText primary='Test 5' />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Grid>
          </Grid>
        </Container>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(HomeForm) as any) as React.ComponentClass<HomeProps>;
