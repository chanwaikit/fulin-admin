/* eslint-disable */
import each from 'lodash/each';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

import request from 'superagent';
import {message} from 'antd'

const noop = () => {};
const apiBase = `${window.location.origin}`;

const callApi = ({
  custom = false,
  api = '',
  type = 'POST',
  data = {},
  success = noop,
  error = noop
}) => {
  return new Promise((resolve, reject) => {
    request(type, custom?`${api}`:apiBase + api)
      .timeout(200000)
      // .type('form')
      // .set('Content-Type','application/json')
      .type('application/json')
      .set("Authorization","bearer 1df89lYIY+J9i0xVBrqxroXOhq/yGcG1tD8kc3eiWT++Ss5RrredrVr6gqsBGFMPR6BvtRmIq4ggfBZE+futlE7gcKnLBsUBmHadvSLBoAdm0dbryA")

      .withCredentials()
      .send(toFlattenMap(data))
      .end((err, res) => {
        if(res && res.body && res.body.code === -999){
          console.log('未登录');
          // location.replace(`${location.origin}/#/login`)
          window.location.href = `${location.origin}/#/login`
        } else if (res && res.body && res.body.code !== 1) {
          // not alert, console log
          console.log(`not 200 error msg:${err}`);
          if(error){
            error(err);
            reject(err);

          }else{
            message.error(res.body.msg)
            error(err);
            reject(err);
          }
        } else {
          // http res code is 200
          // if (res.body.errorCode === 200) {
          //   // normal
          //   const stringifiedBigNumber = res.text.replace(
          //     /([^\\])":(\d{15,})/g,
          //     '$1":"$2"'
          //   );
          //   const body = JSON.parse(stringifiedBigNumber);
          //   success(body.response);
          //   resolve(body.response);
          // } else if (error) {
          //   error(res.body);
          //   reject(res.body);
          // } else {
          //   console.warn(res.body.errorDescription);
          // }
          if(res && res.text){
            const stringifiedBigNumber = res.text.replace(
              /([^\\])":(\d{15,})/g,
              '$1":"$2"'
            );
            const body = JSON.parse(stringifiedBigNumber);
            success(body);
          }else{
            error(err);
            reject(err);
          }
         
        }
      });
  });
};

export default callApi;

function prepend(prefix, name, separator) {
  if (prefix) {
    if (separator) {
      return `${prefix}.${name}`;
    }
    return prefix + name;
  }
  return name;
}

function flatten(prefix, obj, map) {
  if (obj) {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        flatten(prepend(prefix, `[${i}]`, false), item, map);
      }
    } else if (isPlainObject(obj)) {
      if (obj.__type__ === 'map') {
        each(obj, function (propertyObject, propertyName) {
          if (propertyName !== '__type__') {
            flatten(
              prepend(prefix, `[${propertyName}]`, false),
              propertyObject,
              map
            );
          }
        });
      } else {
        each(obj, function (propertyObject, propertyName) {
          flatten(prepend(prefix, propertyName, true), propertyObject, map);
        });
      }
    } else {
      map[prefix] = obj;
    }
  }
}

function toFlattenMap(obj) {
  const map = {};

  flatten(null, obj, map);
  return map;
}
