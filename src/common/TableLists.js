import React from 'react';
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

function TableListBase(props) {
  const { content, loading, columns } = props;
  console.log(loading);
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

export { TableListBase, getPagination };
