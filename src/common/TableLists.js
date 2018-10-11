import React, { PureComponent } from 'react';
import { getLocale } from 'umi/locale';
import { Table } from 'antd';

const localVal = getLocale();

function getPagination(props) {
  const { totalElements, size, number } = props;
  const pagination = {
    size: 'small',
    showQuickJumper: true,
    pageSize: size,
    total: totalElements,
    current: number + 1,
    showTotal: (total, range) =>
      localVal === 'zh-CN'
        ? `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
        : `${range[0]}-${range[1]} of ${total} items`,
  };
  return pagination;
}

class TableListBase extends PureComponent {
  handleTableChange = pagination => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination);
    }
  };

  render() {
    const { content, loading, columns, totalElements, size, number } = this.props;
    return (
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={content || []}
        size="small"
        pagination={getPagination({ totalElements, size, number })}
        onChange={this.handleTableChange}
      />
    );
  }
}

function TableListBaseFunc(props) {
  const { content, loading, columns } = props;
  // 分页
  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={content || []}
      size="small"
      pagination={getPagination(props)}
    />
  );
}

export { TableListBase, TableListBaseFunc, getPagination };
