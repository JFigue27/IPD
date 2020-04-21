import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/Remove';

interface ExpansionProps {
  panel?: any;
  children?: any;
}

const ControlledExpansionPanels = (props: ExpansionProps) => {
  const [expanded, setExpanded] = React.useState<any>(false);

  const handleChange = (panel: string) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <ExpansionPanelSummary
        expandIcon={
          expanded ? (
            <ExpandLessIcon style={{ background: '#080808', borderRadius: 50, color: '#f2f2f2' }} />
          ) : (
            <ExpandMoreIcon style={{ background: '#d9d9d9', borderRadius: 50, color: '#fff' }} />
          )
        }
      >
        {props.panel}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ background: '#f7f5f6' }}>{expanded && props.children}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
export default ControlledExpansionPanels;
