import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { getAreaName } from '@/utils/BizUtil';

const { Option } = Select;

@connect(({ car }) => ({
  carPageList: car.carPageList,
}))
class CarInputWidget extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || '';
    this.state = {
      eid: value,
      data: [],
    };
  }

  handleSearch = value => {
    const { dispatch } = this.props;
    const param = { query: { eidLike: value }, page: 0, size: 50 };
    dispatch({
      type: 'car/reqCommon',
      service: 'queryCarList',
      payload: param,
      callback: () => {
        const { carPageList } = this.props;
        this.setState({ data: carPageList.content });
      },
    });
  };

  handleChange = value => {
    console.log(value);
    this.setState({ eid: value });
    this.triggerChange(value);
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { disabled } = this.props;
    const { data, eid } = this.state;
    const options = data.map(d => (
      <Option key={d.eid}>{`${d.eid}（${getAreaName(d.areaId)}）`}</Option>
    ));
    return (
      <Select
        showSearch
        value={eid}
        style={{ width: '100%' }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        disabled={disabled}
      >
        {options}
      </Select>
    );
  }
}

export default CarInputWidget;
