import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

interface Props {
  onChange(entity: any, targetProp: string, newValue: any): any;
  owner: any;
  options: Array<any>;
  targetProp: string;
  label?: string;
  disabled?: boolean;
  displayValue?: string;
  flat?: boolean;
  callback?(entity: any): any;
  fromProp?: string;
  autoSelect?: boolean;
}

class AutocompleteWidget extends React.Component<Props> {
  state = {
    value: null
  };

  _onChange = (event, value = {}) => {
    const { flat, targetProp, callback, owner, fromProp = 'Value' } = this.props;

    let entity = { ...owner };
    if (flat) entity[targetProp] = value;
    else if (callback) callback(entity);
    else if (fromProp) {
      if (value == null) {
        entity[targetProp] = null;
        entity['_' + targetProp] = null;
      } else {
        entity[targetProp] = value[fromProp];
        entity['_' + targetProp] = value;
      }
    }

    this.setState({ value });
    this.props.onChange(entity, targetProp, value);
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { options: nextOptions, owner: nextOwner } = nextProps;
    const { options, owner, targetProp, flat, fromProp = 'Value' } = this.props;

    const { value: nextValue } = nextState;
    const { value } = this.state;

    if (nextOptions != options) {
      // console.log(targetProp + ' different options, will render');
      return true;
    } else if (nextValue != value) {
      // console.log(targetProp + ' different value, will render');
      return true;
    } else if (owner[targetProp] != nextOwner[targetProp]) {
      // console.log(targetProp + ' different owner[targetProp], will render');
      return true;
    }

    if (flat) {
      if (nextValue != nextOwner[targetProp]) {
        return true;
      }
    } else if (fromProp && nextOwner && nextValue && nextValue[fromProp] != nextOwner[targetProp]) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    const { options, flat, targetProp, callback, owner, fromProp = 'Value' } = this.props;

    let value = null;
    if (flat) {
      value = owner[targetProp];
    } else {
      if (owner && targetProp && options) {
        let found = options.find(o => o[fromProp] == owner[targetProp]);
        if (found) {
          value = found;
        }
      }
    }

    this.setState({ value });
  }

  componentDidUpdate(prevProps, prevState) {
    const { owner, targetProp, flat, options, fromProp = 'Value', callback, onChange } = this.props;
    const { value: prevValue } = prevState;
    const { value } = this.state;

    if (owner && owner[targetProp] != prevValue) {
      var entity = { ...owner };

      if (flat) {
        this.setState({ value: entity[targetProp] });
        onChange(entity, targetProp, value);
      } else if (callback) {
        //TODO
        // callback(owner);
      } else {
        //FromProp
        if (owner[targetProp] == null) {
          this.setState({ value: null });
          onChange(entity, targetProp, null);
        } else {
          let found = options?.find(o => o[fromProp] == entity[targetProp]);
          if (found) {
            this.setState({ value: found });
            onChange(entity, targetProp, value);
          } else {
            debugger;
            console.log('not found');
          }
        }
      }
    }
  }

  render() {
    const { options, targetProp, label = '', disabled, displayValue = 'displayValue', flat = false, autoSelect } = this.props;
    const { value } = this.state as any;

    // console.log(targetProp + ' render autocomplete');

    let getOptionLabel;
    if (flat) getOptionLabel = (o: any) => o || '';
    else getOptionLabel = (o: any) => o[displayValue] || '';

    return (
      <Autocomplete
        id={targetProp}
        options={options || []}
        value={value}
        onChange={this._onChange}
        renderInput={params => <TextField {...params} label={label} fullWidth autoComplete='off' />}
        disabled={disabled}
        autoSelect={autoSelect}
        autoHighlight
        getOptionLabel={getOptionLabel}
      />
    );
  }
}

export default AutocompleteWidget;
