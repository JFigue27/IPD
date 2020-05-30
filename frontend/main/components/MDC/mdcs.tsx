import React from 'react';
import { withRouter } from 'next/router';
import { withSnackbar } from 'notistack';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import SearchBox from '../../widgets/Searchbox';
import Pagination from 'react-js-pagination';
import ListContainer, { ListProps } from '../../core/ListContainer';

///start:generated:dependencies<<<
import { Table } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Container } from '@material-ui/core';
import Dialog from '../../widgets/Dialog';
import Mdc from '../../components/MDC/mdc';
import { AppBar } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
///end:generated:dependencies<<<

import MDCService from './mdc.service';

const service = new MDCService();
const defaultConfig = {
  service,
  filterName: 'MDCs',
  sortname: 'MDCs'
};

interface MDCProps extends ListProps {}

class MDCsList extends ListContainer<MDCProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<
    this.load();

    ///end:slot:load<<<
  }

  AFTER_CREATE = instance => {
    ///start:slot:aftercreate<<<
    this.openDialog('mdc', instance);
    ///end:slot:aftercreate<<<
  };

  ON_OPEN_ITEM = item => {
    ///start:slot:onopenitem<<<
    this.openDialog('mdc', item);
    ///end:slot:onopenitem<<<
  };

  render() {
    let { isLoading, baseEntity, baseList, filterOptions, isDisabled } = this.state;

    console.log(baseList);

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container className='lg' style={{ padding: 10 }} maxWidth='lg'>
          <Grid item container direction='row' justify='center' spacing={2} alignItems='baseline'>
            <Grid item xs={12} sm>
              <Typography variant='h5' gutterBottom>
                MDC-List
              </Typography>
            </Grid>
            <Grid item xs={12} sm />

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
          </Grid>

          <Paper style={{ width: '100%', overflowX: 'auto' }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell variant='head'></TableCell>
                  <TableCell variant='head'>Control Number</TableCell>
                  <TableCell variant='head'>Document Title</TableCell>
                  <TableCell variant='head'>Process Type</TableCell>
                  <TableCell variant='head'>Department Area</TableCell>
                  <TableCell variant='head'>Owner</TableCell>
                  <TableCell variant='head'>Is Need Training</TableCell>
                  <TableCell variant='head'>MDC Dead Line</TableCell>
                  <TableCell variant='head'>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {baseList &&
                  baseList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Grid container direction='row' justify='center' alignItems='flex-end' spacing={1}>
                          <Grid item xs={6}>
                            <IconButton
                              onClick={event => {
                                this.openItem(event, item);
                              }}
                              size='small'
                            >
                              <Icon>edit</Icon>
                            </IconButton>
                          </Grid>
                          <Grid item xs={6}>
                            <IconButton
                              color='secondary'
                              onClick={event => {
                                this.removeItem(event, item);
                              }}
                              size='small'
                            >
                              <Icon>delete</Icon>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.ControlNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.DocumentTitle}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.ProcessType}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.DepartmentArea}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.Owner}</Typography>
                      </TableCell>
                      <TableCell>{(item.IsNeedTraining || '').toString().toUpperCase()}</TableCell>
                      <TableCell>{this.formatDate(item.MDCDeadLine)}</TableCell>
                      <TableCell>
                        <Typography align='left'>{item.Comments}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>

        <Dialog opener={this} id='mdc' okLabel='Save' fullScreen dividersOff>
          {dialog => <Mdc dialog={dialog} data={(this.state as any)['mdc']} /* Mdc={'Create'} */ />}
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
              className='fab'
              variant='contained'
              size='small'
              onClick={event => {
                event.stopPropagation();
                this.openDialog('mdc', event);
              }}
            >
              create
            </Button>
          </Toolbar>
        </AppBar>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(MDCsList) as any) as React.ComponentClass<MDCProps>;
