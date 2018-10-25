export function getFormExtraMsg(maxUpdNum) {
  let msgNum = 3;
  if (maxUpdNum) {
    msgNum = maxUpdNum;
  }
  return `最多可以上传${msgNum}张，按住Ctrl键可以选中多张图片`;
}

export function getFilePrefix(filename) {
  const pos = filename.lastIndexOf('.');
  let prefix = '';
  if (pos !== -1) {
    prefix = filename.substring(0, pos);
  }
  return prefix;
}

export function getFileSuffix(filename) {
  const pos = filename.lastIndexOf('.');
  let suffix = '';
  if (pos !== -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

export function normFile(e) {
  if (Array.isArray(e)) {
    return e;
  }
  console.log(e && e.fileList);
  return e && e.fileList;
}

export function checkImgMax(maxUpdNum, hadUpdNum, form, field, isErr) {
  const value = form.getFieldValue(field);
  if (!isErr) {
    form.setFields({
      [field]: {
        value,
        errors: [],
      },
    });
  } else {
    form.setFields({
      [field]: {
        value,
        errors: [new Error(`最多只能上传${maxUpdNum}张，当前还可上传${maxUpdNum - hadUpdNum}张`)],
      },
    });
  }
}
