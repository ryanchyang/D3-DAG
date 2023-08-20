import axios from '../../src/config/AxiosConfig'
import { encryptedData } from '../util/encrypt'
import React from 'react'
import { useRouter } from "next/router";

async function get(url, data) {
  const res = await axios.get(url, { params: data })
  return new Promise((resolve, reject) => {
    if (res.data.code === 'G_0000') {
      resolve(res)
    } else if (res.data.code === 'G_0201' || res.data.code === 'G_0202') {
      // Notice.error({
      //   title: i18n.messages[i18n.locale][res.data.code] || res.data.code
      // })
      // router.push('/index')
    } else {
      reject(res)
    }
  })
}

const post = async(url, data) => {
  // const encrypte = await encryptedData(data, 'post')
  const res = await axios.post(url, data)
  return new Promise((resolve, reject) => {
    if (res.data.code === 'G_0000') {
      resolve(res)
    } else if (res.data.code === 'G_0201' || res.data.code === 'G_0202') {
    // Notice.error({
    //   title: i18n.messages[i18n.locale][res.data.code] || res.data.code
    // })
    // router.push('/index')
    } else {
      reject(res)
    }
  })
}

export const api = { get, post }
export const AxoisData = React.createContext(api)