import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Tag, Input, Icon } from 'antd';

let tagsFromServer = ['红色', '黑色', '白色', '银色', '绿色', '黄色', '蓝色'];
const getTagsColor = tag => {
  switch (tag) {
    case '红色':
      return 'red';
    case '黑色':
      return 'black';
    case '白色':
      return '#ddd';
    case '银色':
      return '';
    case '绿色':
      return 'green';
    case '黄色':
      return 'yellow';
    case '蓝色':
      return 'blue';
    default:
      return '';
  }
};

class ColorInputWidget extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || '';
    this.state = {
      selectedTag: value,
      inputVisible: false,
      inputValue: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ selectedTag: value });
      if (value) {
        if (tagsFromServer.indexOf(value) < 0) {
          tagsFromServer.push(value);
        }
      }
    }
  }

  componentWillUnmount() {
    tagsFromServer = ['红色', '黑色', '白色', '银色', '绿色', '黄色', '蓝色'];
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { tags } = state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleChange(tag, checked) {
    const nextSelectedTag = checked ? tag : null;
    this.setState({ selectedTag: nextSelectedTag });
    if (checked) {
      this.triggerChange(tag);
    } else {
      this.triggerChange(null);
    }
  }

  render() {
    const { selectedTag, inputVisible, inputValue } = this.state;
    return (
      <div>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}>
          <FormattedMessage id="biz.car.color" defaultMessage="No translate" />
          &nbsp;&nbsp;
        </span>
        {tagsFromServer.map(tag => {
          const styleVal = selectedTag === tag ? { color: '#FFF', backgroundColor: '#108ee9' } : {};
          return (
            <Tag
              color={getTagsColor(tag)}
              key={tag}
              style={styleVal}
              onClick={checked => this.handleChange(tag, checked)}
            >
              {tag} {selectedTag === tag ? <Icon type="check" /> : null}
            </Tag>
          );
        })}

        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> 其他颜色
          </Tag>
        )}
      </div>
    );
  }
}

export default ColorInputWidget;
