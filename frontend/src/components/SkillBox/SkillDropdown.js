import React, { Component } from 'react';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import skillOptions from '../../skills.json';

const filterSkills = (inputValue) => {
  return skillOptions.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterSkills(inputValue));
  }, 1000);
};

const orderOptions = values => {
  return values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));
};

export default class MultiSelect extends Component {
  state = { value: '' };
  
  onChange = (value, { action, removedValue }) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        value = skillOptions.filter(v => v.isFixed);
        break;
    }

    value = orderOptions(value);
    this.setState({ value: value });
  }

  returnValue = () => {
    return this.state.value;
  }

  render() {
    return (
      <div>
        <AsyncSelect
          value={this.state.value}
          cacheOptions
          loadOptions={loadOptions}
          isMulti
          placeholder="Start typing..."
          onChange={this.onChange}
        />
      </div>
    );
  }
}