import React from 'react';
import { withRouter } from 'next/router';
import { withSnackbar } from 'notistack';
import { NoSsr, Typography, Grid } from '@material-ui/core';
import SearchBox from '../../widgets/Searchbox';
import Pagination from 'react-js-pagination';
import ListContainer, { ListProps } from '../../core/ListContainer';

///start:generated:dependencies<<<
import { Button } from '@material-ui/core';
import { Table } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Container } from '@material-ui/core';
import Dialog from '../../widgets/Dialog';
import Approver from '../../components/Approver/approver';
///end:generated:dependencies<<<

import ApproverService from './approver.service';

const service = new ApproverService();
const defaultConfig = {
  service,
  filterName: 'Approvers',
  sortname: 'Approvers'
};

interface ApproverProps extends ListProps {
  mdc?: any;
}

class ApproversList extends ListContainer<ApproverProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));
  }

  componentDidMount() {
    ///start:slot:load<<<
    if (this.props.mdc && this.props.mdc.Id) {
      this.load('MDCId=' + this.props.mdc.Id);
    } else {
      let { baseList } = this.state;
      baseList.push({});
      this.setState({ baseList });
    }
    // this.load();
    ///end:slot:load<<<
  }

  AFTER_CREATE = async instance => {
    ///start:slot:aftercreate<<<
    this.openDialog('approver', instance);
    ///end:slot:aftercreate<<<
  };

  ON_OPEN_ITEM = item => {
    ///start:slot:onopenitem<<<
    this.openDialog('approver', item);
    ///end:slot:onopenitem<<<
  };

  render() {
    let { isLoading, baseEntity, baseList, filterOptions, isDisabled } = this.state;

    return (
      <NoSsr>
        {/* ///start:generated:content<<< */}

        <Container className='md' style={{ padding: 20 }} maxWidth='md'>
          <Grid item container direction='row' justify='center' spacing={2} alignItems='baseline'>
            <Grid item xs={12} sm>
              <Typography variant='h5' gutterBottom>
                Approvers
              </Typography>
            </Grid>
            <Grid item xs={12} sm />

            <Grid item xs={12} sm>
              <Button
                variant='contained'
                size='small'
                onClick={event => {
                  event.stopPropagation();
                  this.createInstance({ MDCId: this.props.mdc.Id });
                }}
              >
                New Approver
              </Button>
            </Grid>
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
                  <TableCell variant='head'>Approver Name</TableCell>
                  <TableCell variant='head'>Department Area</TableCell>
                  <TableCell variant='head'>Deadline</TableCell>
                  <TableCell variant='head'>Approval Status</TableCell>
                  <TableCell variant='head'>Approval Comments</TableCell>
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
                        <Typography align='left'>{item.ApproverName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.DepartmentArea}</Typography>
                      </TableCell>
                      <TableCell>{this.formatDate(item.Deadline)}</TableCell>
                      <TableCell>
                        <Typography align='left'>{item.ApprovalStatus}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align='left'>{item.ApprovalComments}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>

        <Dialog opener={this} id='approver' title='Approver' okLabel='Save' maxWidth='sm'>
          {dialog => <Approver dialog={dialog} data={(this.state as any)['approver']} MDCId={this.props.mdc.Id} />}
        </Dialog>

        {/* ///end:generated:content<<< */}
      </NoSsr>
    );
  }
}

export default withSnackbar(withRouter(ApproversList) as any) as React.ComponentClass<ApproverProps>;
