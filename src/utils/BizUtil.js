import React, { Fragment } from 'react';
import { Avatar, Modal, Badge, message } from 'antd';
import { formatMessage } from 'umi/locale';
import Ellipsis from '../components/Ellipsis';
import BizConst from '@/common/BizConst';
import { AREA_DATA, AREA_DATA_KEYVALUE } from '@/common/AreaJson';

function isResOK(response, noWarn) {
  if (response && response.status === 400) {
    if (!noWarn) {
      message.error(response.message || formatMessage({ id: 'validation.error.unknown' }));
    }
    return false;
  }
  return true;
}

function deleteConfirm(text, id, delExcute) {
  Modal.confirm({
    title: `删除${text}`,
    content: `确定删除该${text}吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk: () => delExcute(id),
  });
}

function getAreaId(areaIdArr) {
  if (areaIdArr) {
    const { length } = areaIdArr;
    if (length > 0) return parseInt(areaIdArr[length - 1], 10);
  }
  return null;
}

function getAreaArr(areaId) {
  const areaArr = [];
  const provId = parseInt(areaId / 10000, 10) * 10000;
  const cityId = parseInt(areaId / 100, 10) * 100;
  areaArr.push(`${provId}`);
  if (provId !== 110000 && provId !== 310000 && provId !== 120000 && provId !== 500000) {
    areaArr.push(`${cityId}`);
  }
  areaArr.push(`${areaId}`);
  return areaArr;
}

function getAreaName(areaId) {
  return AREA_DATA_KEYVALUE[areaId];
}

function getAreaNameTest() {
  const { areaIds } = AREA_DATA;
  let jsoProv;
  let cityArr;
  let jsoCity;
  let areaArr;
  let jsoArea;
  let strs;
  for (let i = 0; i < areaIds.length; i += 1) {
    jsoProv = areaIds[i];
    cityArr = jsoProv.children;
    for (let j = 0; j < cityArr.length; j += 1) {
      jsoCity = cityArr[j];
      if ('children' in jsoCity) {
        areaArr = jsoCity.children;
        for (let k = 0; k < areaArr.length; k += 1) {
          jsoArea = areaArr[k];
          strs += `,${jsoArea.value}:"${jsoArea.label}"`;
        }
      } else {
        strs += `,${jsoCity.value}:"${jsoCity.label}"`;
      }
    }
  }
  console.log(strs);
}

function convUname(uname, sex) {
  let icon = 'user';
  let bgColor = '#E9E9E9';
  if (sex === 'M') {
    icon = 'man';
    bgColor = '#d2eafb';
  } else if (sex === 'F') {
    icon = 'woman';
    bgColor = '#fdd8e7';
  }
  return (
    <Fragment>
      <Avatar size="small" icon={icon} style={{ backgroundColor: bgColor }} />
      <Ellipsis tooltip={uname} style={{ display: 'inline', marginLeft: 2 }} length={5}>
        {uname}
      </Ellipsis>
    </Fragment>
  );
}

function getStatus4FuelType(fuelType) {
  switch (fuelType) {
    case '汽油':
      return BizConst.statusMap[1];
    case '柴油':
      return BizConst.statusMap[2];
    case '电动':
      return BizConst.statusMap[3];
    case '其他':
      return BizConst.statusMap[4];
    default:
      return BizConst.statusMap[0];
  }
}

function getEquipByType(type) {
  switch (type) {
    case 0:
      return <Badge status="processing" text="固定设备" />;
    case 1:
      return <Badge status="warning" text="辅助设备" />;
    default:
      return null;
  }
}

function renderForNull(val, rtnVal) {
  if (!val) return rtnVal;
  return val;
}

export {
  isResOK,
  deleteConfirm,
  getAreaId,
  getAreaArr,
  getAreaName,
  getAreaNameTest,
  convUname,
  getStatus4FuelType,
  getEquipByType,
  renderForNull,
};
