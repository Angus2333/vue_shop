"use strict";

exports.__esModule = true;
exports.toArray = toArray;
exports.readFileContent = readFileContent;
exports.isOversize = isOversize;
exports.filterFiles = filterFiles;
exports.isImageUrl = isImageUrl;
exports.isImageFile = isImageFile;

function toArray(item) {
  if (Array.isArray(item)) {
    return item;
  }

  return [item];
}

function readFileContent(file, resultType) {
  return new Promise(function (resolve) {
    if (resultType === 'file') {
      resolve();
      return;
    }

    var reader = new FileReader();

    reader.onload = function (event) {
      resolve(event.target.result);
    };

    if (resultType === 'dataUrl') {
      reader.readAsDataURL(file);
    } else if (resultType === 'text') {
      reader.readAsText(file);
    }
  });
}

function isOversize(items, maxSize) {
  return toArray(items).some(function (item) {
    return item.file && item.file.size > maxSize;
  });
}

function filterFiles(items, maxSize) {
  var valid = [];
  var invalid = [];
  items.forEach(function (item) {
    if (item.file && item.file.size > maxSize) {
      invalid.push(item);
    } else {
      valid.push(item);
    }
  });
  return {
    valid: valid,
    invalid: invalid
  };
}

var IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;

function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}

function isImageFile(item) {
  // some special urls cannot be recognized
  // user can add `isImage` flag to mark it as an image url
  if (item.isImage) {
    return true;
  }

  if (item.file && item.file.type) {
    return item.file.type.indexOf('image') === 0;
  }

  if (item.url) {
    return isImageUrl(item.url);
  }

  if (item.content) {
    return item.content.indexOf('data:image') === 0;
  }

  return false;
}