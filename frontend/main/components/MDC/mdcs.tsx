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
import { Container } from '@material-ui/core';
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

interface MDCProps extends ListProps {

}

class MDCsList extends ListContainer<MDCProps> {
  constructor(props, config) {
    super(props, Object.assign(defaultConfig, config));

  }

  render() {
    let { isLoading, baseEntity, baseList, filterOptions, isDisabled } = this.state;

    return (
      <NoSsr>
{/* ///start:generated:content<<< */}

<Container className="lg" style={{"padding":20}} maxWidth='lg'><Grid item container direction="row"  justify="center" spacing={2} alignItems="baseline">
    	<Grid item xs={12} sm>
<Typography variant="h5"  gutterBottom>
        MDC-List
    </Typography>
</Grid>
	<Grid item xs={12} sm />

	<Grid container direction="row">
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
    <Table  size='small'>
    <TableHead>
        <TableRow>
        
<TableCell variant='head' >
    
</TableCell>
<TableCell variant='head' >
    Control Number
</TableCell>
<TableCell variant='head' >
    Document Title
</TableCell>
<TableCell variant='head' >
    Process Type
</TableCell>
<TableCell variant='head' >
    Department Area
</TableCell>
<TableCell variant='head' >
    Owner
</TableCell>
<TableCell variant='head' >
    Approvers
</TableCell>
<TableCell variant='head' >
    Comments
</TableCell>
        </TableRow>
        
    </TableHead>
    <TableBody>
        {baseList && baseList.map((item, index) => (
        <TableRow key={index}   >
            
<TableCell  >

<Button  variant='contained' size='small' onClick={event =>{event.stopPropagation(); this.removeItem(event, item)}}>
   <Icon>delete</Icon> removeItem
</Button>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.ControlNumber}</Typography>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.DocumentTitle}</Typography>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.ProcessType}</Typography>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.DepartmentArea}</Typography>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.Owner}</Typography>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.Approvers}</Typography>

</TableCell>
<TableCell  >
    <Typography align='left'>{item.Comments}</Typography>

</TableCell>
        </TableRow>
        ))}
        
    </TableBody>
    </Table>
</Paper>
</Container>

<AppBar position="fixed"  style={{ top: 'auto', bottom: 0 }}>
        <Toolbar variant="dense">
            <SearchBox bindFilterInput={this.bindFilterInput} value={filterOptions.filterGeneral} clear={() => this.clearInput('filterGeneral')} />
<Grid item xs={12} sm />

<Button className="fab" variant='contained' size='small' onClick={event =>{event.stopPropagation(); this.createInstance({})}}>
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