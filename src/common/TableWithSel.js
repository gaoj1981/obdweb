import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Table, Alert, Modal } from 'antd';
import styles from '@/components/StandardTable/index.less';
import { getPagination } from './TableLists';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class TableWithSel extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = pagination => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  deleteSelected = () => {
    Modal.confirm({
      title: `删除选中项`,
      content: `确定删除所有选中项吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { onDelete } = this.props;
        if (onDelete) onDelete();
      },
    });
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { content, loading, columns, rowKey, totalElements, size, number } = this.props;

    const paginationProps = getPagination({ totalElements, size, number });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {needTotalList.map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}
                    总计&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render ? item.render(item.total) : item.total}
                    </span>
                  </span>
                ))}
                {selectedRowKeys && selectedRowKeys.length > 0 ? (
                  <a onClick={this.cleanSelectedKeys} style={{ float: 'right' }}>
                    清空
                  </a>
                ) : null}
                {selectedRowKeys && selectedRowKeys.length > 0 ? (
                  <a onClick={this.deleteSelected} style={{ marginLeft: 24 }}>
                    <FormattedMessage id="form.delete" defaultMessage="No translate" />
                  </a>
                ) : null}
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={content}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default TableWithSel;
