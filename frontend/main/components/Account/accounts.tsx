import React from 'react';
import { withRouter } from 'next/router';
import { withSnackbar } from 'notistack';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import SearchBox from '../../widgets/Searchbox';
import Pagination from 'react-js-pagination';
import ListContainer, { ListProps } from '../../core/ListContainer';

import { Container } from '@material-ui/core';
import { Table } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Dialog from '../../widgets/Dialog';
import AccountBasic from './accountBasic';
import { AppBar } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';

import AccountService from './account.service';

const service = new AccountService();
const defaultConfig = {
  service,
  filterName: 'Accounts',
  sortname: 'Accounts',
  limit: 15
};

interface AccountProps extends ListProps {}

class AccountsList extends ListContainer<AccountProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    this.load();
  }

  AFTER_LOAD = baseList => {};

  AFTER_CREATE = instance => {
    this.openDialog('account', instance);
  };

  ON_OPEN_ITEM = item => {
    this.openDialog('account', item);
  };

  AFTER_SAVE = entity => {
    this.refresh();
  };

  render() {
    const { isLoading, baseEntity, baseList, filterOptions, isDisabled } = this.state;

    return (
      <NoSsr>
        <Container style={{ padding: 20 }} maxWidth='lg'>
          <Grid container direction='row'>
            <Grid item xs />
            <Pagination
              activePage={filterOptions.page}
              itemsCountPerPage={filterOptions.limit}
              totalItemsCount={filterOptions.itemsCount}
              pageRangeDisplayed={5}
              onChange={newPage => {
                this.pageChanged(newPage);
              }}
            />
          </Grid>
          {!isLoading && (
            <>
              <Paper style={{ width: '100%', overflowX: 'auto' }}>
                <Table size='small' className='AccountsList'>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell>Display Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Modified Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {baseList &&
                      baseList.map((item, index) => (
                        <TableRow key={item.Id}>
                          <TableCell>
                            <IconButton
                              onClick={event => {
                                this.openItem(event, item);
                              }}
                            >
                              <Icon>edit</Icon>
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography>{item.UserName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{item.DisplayName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{item.Email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{item.CSVRoles}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{item.PhoneNumber}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{this.formatDate(item.CreatedDate)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{this.formatDate(item.ModifiedDate)}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            </>
          )}
        </Container>
        <Dialog opener={this} id='account' title='Account' okLabel='save'>
          {dialog => <AccountBasic dialog={dialog} data={this.state.account} />}
        </Dialog>
        <AppBar position='fixed' style={{ top: 'auto', bottom: 0 }}>
          <Toolbar variant='dense'>
            <SearchBox
              bindFilterInput={this.bindFilterInput}
              value={filterOptions.filterGeneral}
              clear={() => this.clearInput('filterGeneral')}
            />
            <Grid item xs={12} sm />
            <Button
              variant='contained'
              color='default'
              onClick={event => {
                this.createInstance({});
              }}
            >
              <Icon>add_circle</Icon>New
            </Button>
          </Toolbar>
        </AppBar>
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(AccountsList) as any) as React.ComponentClass<AccountProps>;
