import { useState, useContext, useEffect, useMemo } from 'react'
import {
  Button,
  Row,
  Col,
  DatePicker,
  Popover,
  Input,
  InputNumber,
  Spin,
  Form,
  Select,
} from 'antd'
import VisxTree from './VisxTree'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { LeftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { ParentSize } from '@visx/responsive'
// import SearchInput from '../search/searchInput'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import moment from 'moment'
import data from './Data2'

const initRootAddress = '0x67dc41bedc78be08f8c4efc988ffdb4637f59e6b'

const markInterface = {
  GREEN: 'Safe',
  RED: 'Danger',
  ORANGE: 'Warning',
  YELLOW: 'Caution',
}

const Index = ({ theme }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    address: null,
    fromDate: null,
    toDate: null,
  })
  // const [rootAdrress, setRootAddress] = useState(initRootAddress);
  const [currentGraphData, setCurrentGraphData] = useState([])
  const [graphIsLoading, setGraphIsLoading] = useState(false)

  const [nodeAmount, setNodeAmount] = useState(data.length)

  const { t, i18n } = useTranslation()

  const {
    handleSubmit,
    control,
    setValue,
    reset: resetForm,
    formState: { isValid, errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      colorType: 'GREEN',
      content: '',
      appendId: [],
      appendAs: '',
    },
    mode: 'onChange',
  })

  // console.log(currentGraphData);
  //! -------------------------get區開始
  const getAddressTrace = async (rootAdrress, fromDate, toDate) => {
    const params = {
      address: rootAdrress,
      chain: 'ETH',
      prevSize: 5,
      nextSize: 5,
      startTime: fromDate ? fromDate : null,
      endTime: toDate ? toDate : null,
    }
    try {
      const { data } = await api.get('/gateway/client/trace/address', params)
      return data.data
    } catch (err) {
      console.log('err', err)
    }
  }
  //! -------------------------get區結束
  //! -------------------------handler區開始
  const updateGraph = async ({ colorType, content, appendId, appendAs }) => {
    if (appendAs === 'parent') {
      setCurrentGraphData([
        ...currentGraphData.map(item => ({
          ...item,
          parentIds: appendId.includes(item.id)
            ? [...item.parentIds, nodeAmount + '']
            : item.parentIds,
        })),
        {
          id: nodeAmount + '',
          address: content,
          mark: markInterface[colorType],
          parentIds: [],
        },
      ])
    }
    if (appendAs === 'child') {
      setCurrentGraphData([
        ...currentGraphData,
        {
          id: nodeAmount + '',
          address: content,
          mark: markInterface[colorType],
          parentIds: [...appendId],
        },
      ])
    }

    // setCurrentGraphData(dataListEdited)
    setGraphIsLoading(false)
  }

  const onFinish = values => {
    console.log('Success:', values)
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  const onSubmit = data => {
    console.log({ data })
    setGraphIsLoading(true)
    resetForm()
    const timer = setTimeout(() => {
      setNodeAmount(nodeAmount + 1)
      updateGraph(data)
    }, 1000)

    // trigger({ quoteAmount: quoteValue })
  }
  //! -------------------------handler區結束
  //! -------------------------modal區開始
  //! -------------------------modal區結束
  //! -------------------------post區開始
  //! -------------------------post區結束
  //! -------------------------constants區開始
  const idSelectItems = useMemo(
    () =>
      Array.from({ length: nodeAmount }).map((_, i) => ({
        value: i + '',
        label: i + 1,
      })),
    [nodeAmount]
  )
  //! -------------------------constants區結束

  // useEffect(() => {
  //   if (!formData.address) return
  //   setGraphIsLoading(true)
  //   updateGraph()
  // }, [formData])

  // 進到頁面抓取地址
  // useEffect(() => {
  //   if (!router.query.key) return
  //   setFormData({ ...formData, address: router.query.key })
  // }, [router.query.key])

  //   first load the data 1
  useEffect(() => {
    setGraphIsLoading(true)
    const timer = setTimeout(() => {
      setCurrentGraphData(data)
      setGraphIsLoading(false)
    }, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* 搜尋欄位 */}
      {/* <div className="searchIndex">
        <div className="commonInput">
          <SearchInput theme={theme} />
        </div>
      </div> */}
      <h2
        className="tracking-warning"
        style={{ color: 'black', paddingTop: 50, textAlign: 'center' }}
      >
        Please check the graph in PC
      </h2>
      <div className="tracking">
        {/* search area */}
        <div className="search-area">
          <div className="bg">
            <div className="bg-blur"></div>
          </div>
          <Form
            name={'add-tag'}
            labelCol={{
              span: 24,
            }}
            onFinish={handleSubmit(onSubmit)}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row gutter={[12, 0]}>
              <Col span={6}>
                <Form.Item
                  label={<span className="subFont-B-25">Tag color</span>}
                  // validateStatus={errors.baseValue ? 'error' : ''}
                  // help={errors.baseValue ? t(errors.baseValue.message) : ''}
                  // className="form-item-default error-hidden"
                >
                  <Controller
                    name="colorType"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          size="large"
                          {...field}
                          options={[
                            {
                              value: 'GREEN',
                              label: 'Green',
                            },
                            {
                              value: 'RED',
                              label: 'Red',
                            },
                            {
                              value: 'ORANGE',
                              label: 'Orange',
                            },
                            {
                              value: 'YELLOW',
                              label: 'Orange',
                            },
                          ]}
                        />
                      )
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={<span className="subFont-B-25">Content</span>}
                  // validateStatus={errors.baseValue ? 'error' : ''}
                  // help={''}
                  // className="form-item-default error-hidden"
                >
                  <Controller
                    name="content"
                    control={control}
                    rules={{
                      required: true,
                      maxLength: 8,
                    }}
                    render={({ field }) => {
                      return (
                        <Input {...field} placeholder="Max length: 8 letters" />
                      )
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={<span className="subFont-B-25">Append ID</span>}
                  // validateStatus={errors.baseValue ? 'error' : ''}
                  // help={'Select ID you append with'}
                  // className="form-item-default error-hidden"
                >
                  <Controller
                    name="appendId"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          size="large"
                          {...field}
                          mode="multiple"
                          placeholder="Select IDs you append with"
                          // defaultValue={['a10', 'c12']}
                          // onChange={handleChange}
                          options={idSelectItems}
                        />
                      )
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={<span className="subFont-B-25">Append as</span>}
                  // validateStatus={errors.baseValue ? 'error' : ''}
                  // help={'Select ID you append with'}
                  // className="form-item-default error-hidden"
                >
                  <Controller
                    name="appendAs"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          size="large"
                          {...field}
                          placeholder="Select ID you append with"
                          options={[
                            {
                              value: 'parent',
                              label: 'Parent',
                            },
                            {
                              value: 'child',
                              label: 'Child',
                            },
                          ]}
                        />
                      )
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} align="right">
                <Button htmlType="submit" disabled={!isValid} size="large">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {/* graph area */}
        <div className="graph-area">
          <div className="bg">
            <div className="bg-blur"></div>
          </div>
          {graphIsLoading ? (
            <Spin size="large" className="graph-loading"></Spin>
          ) : null}
          {currentGraphData.length !== 0 ? (
            <div className="graph">
              <ParentSize>
                {parent => (
                  <VisxTree
                    width={parent.width}
                    height={parent.height}
                    currentGraphData={currentGraphData}
                  />
                )}
              </ParentSize>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Index
