import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Spin, Popover, message } from 'antd';
import moment from 'moment';
import useScreen from '@/common/commonHook/useScreen';
import { getRangeDates, milestoneStatusMap, milestoneStatusColorMap, getWeeks } from './config';
import axios from 'axios';
import './index.less'

const ellipsisStyle = {
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
};

const GanttModal = ({ visible, record = {}, dispatch }) => {

  const { width } = useScreen();
  const rightWidth = useMemo(() => width > 1440 ? 0.85 * width - 376 : width - 408, [width]);

  const { okr_proj_name } = record;

  const [loading, setLoading] = useState(false);
  const [dateList, setDateList] = useState([]);

  const fetchDateList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/query_proj_milestone', { OkrProjName: okr_proj_name });
      const { status, error, rows = [] } = res.data || {};
      if (status) {
        rows.forEach(item => {
          if (item.milestone_start_time === item.milestone_end_time) {
            item.milestone_end_time = moment(item.milestone_start_time).add(1, 'days').format("YYYY-MM-DD");
          }
          const beforeToday = +(moment(item.milestone_end_time)) - +(moment()) < 0;
          if (item.milestone_status == -1) { //延期到今天的日期
            item.delay_date = beforeToday ? moment().format("YYYY-MM-DD") : item.milestone_end_time;
          } else if (item.milestone_status == 1) { //进行中今天的日期
            item.going_date = beforeToday ? item.milestone_end_time : moment().format("YYYY-MM-DD");
            item.percent = getRangeDates(item.milestone_start_time, item.going_date).length /
              getRangeDates(item.milestone_start_time, item.milestone_end_time).length;
          } else if (item.milestone_status == 2) {
            item.percent = 1;
          }
        });
        const dates = rows
          .reduce((res, { milestone_end_time, milestone_start_time }) => {
            res.push(...[milestone_end_time, milestone_start_time]);
            return res;
          }, [])
          // 把所有日期转换成当天0点的时间戳，并排序(用于56行获取整个项目的时间跨度)
          .sort((a, b) => moment(a).startOf('day').format('x') - moment(b).startOf('day').format('x'))
        rows.forEach(item => {
          item.rangeDates = getRangeDates(dates[0], dates.slice(-1)[0]);
        });
        setDateList(rows);
      } else {
        message.error(error)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [okr_proj_name]);

  useEffect(() => {
    fetchDateList();
  }, [fetchDateList]);

  useEffect(() => {
    dateList.length && handleBackToday();
  }, [dateList, width]);

  const handleBackToday = () => {
    const today = document.getElementById("ganttRightWrapper");
    const list = ((dateList[0] || {}).rangeDates) || [];
    let avW = (rightWidth - 2) / (list.length - 1);  // 时间轴上每“天”的宽度
    avW = avW > 10 ? avW : 10; // 限制最小宽度
    today.scrollTo({ left: list.indexOf(moment().format("YYYY-MM-DD")) * avW - +(today.style.width.replace('px', '')) / 2, behavior: 'smooth' });
  };

  const StatusList = dateList.map(({ milestone_status }) => milestone_status).filter(i => i !== '');
  let Status;
  if (StatusList.includes(1) || StatusList.includes(2) && StatusList.includes(0)) Status = 1;
  if (StatusList.includes(-1)) Status = -1;
  if (StatusList.every(i => +i === 2)) Status = 2;
  if (StatusList.every(i => +i === 0)) Status = 0;

  return <Modal
    width={width <= 1440 ? '100%' : width * 0.85}
    footer={false}
    title="项目甘特图"
    open={visible}
    maskClosable={false}
    className="gantt-modal"
    onCancel={() => dispatch({ type: 'setVisible', value: { visible: false, record: undefined } })}
  >
    <div className="mb10">
      <span style={{ color: '#72747a' }}>项目名称：</span>
      <span>{okr_proj_name}</span>
    </div>
    <a className="back-today" onClick={handleBackToday}>回到今天</a>
    <Spin spinning={loading} tip="加载中">
      <ul className="gantt-wrapper">
        <div className="gantt-left">
          <li className="stone-header-wrapper">
            <div className="stone-header-1 stone-header">序号</div>
            <div className="stone-header-2 stone-header">milestone</div>
            <div className="stone-header-3 stone-header">状态</div>
          </li>
          {
            [{ milestone_name: '整体进度', milestone_status: Status, strong: true }, ...dateList]
              .map(({ milestone_name, milestone_status, strong }, index) => <li className="stone-content" key={milestone_name}>
                <div className="stone-item-1" style={strong ? { fontWeight: 600 } : {}}>{index || '-'}</div>
                <div className="stone-item-2" style={strong ? { fontWeight: 600 } : {}} title={milestone_name}>
                  {milestone_name.length > 16 ? milestone_name.substring(0, 16) + '...' : milestone_name}
                </div>
                <div className="stone-item-3" style={strong ? { fontWeight: 600 } : {}}>{milestoneStatusMap[milestone_status]}</div>
              </li>)
          }
        </div>
        <div className="gantt-right" id="ganttRightWrapper" style={{ width: rightWidth, overflowX: 'auto' }}>
          <div
            className="line"
            style={{
              left: (() => {
                const list = ((dateList[0] || {}).rangeDates) || [];
                let avW = (rightWidth - 2) / (list.length - 1);
                avW = avW > 10 ? avW : 10;
                return list.indexOf(moment().format("YYYY-MM-DD")) * avW;
              })(),
              height: 'calc(100% - 60px)',
              zIndex: 999
            }}
          ><div className="today-date">今天({moment().format("YYYY-MM-DD")})</div></div>
          <div className="top">
            <ul className="ul-ym">
              {
                (() => {
                  const list = ((dateList[0] || {}).rangeDates) || [];
                  const yearMonths = [...new Set(list.map(date => date.substring(0, 7)))];
                  const yearMonthMap = {};
                  yearMonths.forEach(ym => {
                    yearMonthMap[ym] = [];
                    list.forEach(d => {
                      if (d.includes(ym)) {
                        yearMonthMap[ym].push(d);
                      }
                    });
                  });
                  let avW = (rightWidth - 2) / list.length;
                  avW = avW > 10 ? avW : 10;
                  return Object.keys(yearMonthMap).map(key => <li
                    style={{ width: avW * yearMonthMap[key].length, ...ellipsisStyle }}
                    key={key} title={key}>{key}</li>);
                })()
              }
            </ul>
            <ul className="ul-week">
              {
                (() => {
                  const list = ((dateList[0] || {}).rangeDates) || [];
                  const newList = getWeeks(list, 7);
                  let avW = (rightWidth - 2) / list.length ;
                  avW = avW > 10 ? avW : 10;
                  return newList.map((d, index) => <li style={{ width: avW * d.length, ...ellipsisStyle }} key={d} title={`${index + 1}周`}>{`${index + 1}周`}</li>);
                })()
              }
            </ul>
          </div>
          <div className="bottom">
            {
              [{ summaryList: dateList }, ...dateList].map(({
                milestone_end_time, milestone_name, delay_date, going_date,
                milestone_start_time, milestone_status, summaryList, rangeDates
              }, fIndex) => {
                if (Array.isArray(summaryList)) {  // 第一行整体进度
                  return <div className="summary-box" key={milestone_name + 'summaryList'}>
                    {
                      summaryList.map(({
                        milestone_end_time, milestone_name, percent, delay_date, going_date,
                        milestone_start_time, milestone_status, rangeDates
                      }, index) => {
                        let avW =  (rightWidth - 2) / (rangeDates.length - 1);
                        avW = avW > 10 ? avW : 10;
                        const leftW = index ? rangeDates.indexOf(milestone_start_time) * avW : 0;
                        return milestone_status === 1
                          ? <div
                            key={milestone_name}
                            style={{
                              width: avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1),
                              backgroundColor: '#d6e1fd',
                              position: 'absolute',
                              left: leftW,
                              cursor: 'pointer'
                            }}
                          >
                            <div
                              style={{
                                width: avW * (getRangeDates(milestone_start_time, going_date).length - 1),
                                backgroundColor: milestoneStatusColorMap[milestone_status],
                                height: 20,
                                paddingLeft: 5,
                                color: '#fff'
                              }}
                            >
                              {
                                avW * (getRangeDates(milestone_start_time, going_date).length - 1) > 30
                                && <span
                                  style={{ width: '100%', zoom: 0.7, verticalAlign: 3, display: 'inline-block' }}
                                  title={`预计${(getRangeDates(going_date, milestone_end_time).length - 1)}天后完成`}
                                >
                                  {`${+percent.toFixed(2) * 100}%`}
                                  {avW * (getRangeDates(milestone_start_time, going_date).length - 1) > 108 && `(预计${(getRangeDates(going_date, milestone_end_time).length - 1)}天后完成)`}
                                </span>
                              }
                            </div>
                          </div>
                          : milestone_status === -1
                            ? <div
                              key={milestone_name}
                              style={{
                                width: avW * (getRangeDates(milestone_start_time, delay_date).length - 1),
                                backgroundColor: milestoneStatusColorMap[milestone_status],
                                position: 'absolute',
                                left: leftW,
                                cursor: 'pointer',
                                height: 20,
                                paddingLeft: 5,
                                color: '#fff'
                              }}
                            >
                              {
                                avW * (getRangeDates(milestone_start_time, delay_date).length - 1) >= 108
                                  ? <span style={{ width: '100%', zoom: 0.7, verticalAlign: 3 }}>{`已延期${getRangeDates(milestone_end_time, delay_date).length - 1}天`}</span>
                                  : <span style={{ width: '100%', zoom: 0.7, verticalAlign: 3 }}>延</span>
                              }
                            </div>
                            : <div
                              key={milestone_name}
                              style={{
                                width: avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1),
                                border: milestone_status === 0 ? '1px dashed #ccc' : 'none',
                                backgroundColor: milestoneStatusColorMap[milestone_status],
                                position: 'absolute',
                                left: leftW,
                                height: 20,
                                cursor: 'pointer',
                                paddingLeft: 5,
                                color: '#fff'
                              }}
                            >
                              {
                                milestone_status === 0
                                  ? <>
                                    {
                                      avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1) > 30
                                      && <span
                                        style={{ zoom: 0.7, verticalAlign: 3, color: '#fff', display: 'inline-block', width: '100%' }}
                                        title={milestone_status === 0 && `预计${(getRangeDates(moment().format("YYYY-MM-DD"), milestone_start_time).length - 1)}天后开始`}
                                      >
                                        {percent ? `${+percent.toFixed(2) * 100}%` : '0%'}
                                        {
                                          avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1) > 110 && milestone_status === 0 &&
                                          `(预计${(getRangeDates(moment().format("YYYY-MM-DD"), milestone_start_time).length - 1)}天后开始)`
                                        }
                                      </span>
                                    }
                                  </>
                                  : <>
                                    {
                                      avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1) > 30
                                      && <span style={{ zoom: 0.7, verticalAlign: 3, color: '#fff' }}>
                                        {percent ? `${+percent.toFixed(2) * 100}%` : '0%'}
                                      </span>
                                    }
                                  </>
                              }
                            </div>
                      })
                    }
                  </div>;
                }
                // 每个项目各自的进度
                let avW = (rightWidth - 2) / (rangeDates.length - 1) ;
                avW = avW > 10 ? avW : 10;
                const leftW = fIndex > 1 ? rangeDates.indexOf(milestone_start_time) * avW : 0;
                const beforeToday = +(moment(milestone_end_time)) - +(moment()) <= 0;  // 是否是今天之前的项目
                return <div key={milestone_name + 'item'} className="gantt-content">
                  <Popover
                    title={milestone_name}
                    content={<>
                      <p>状态：{milestoneStatusMap[milestone_status]}</p>
                      <p>
                        开始时间：{milestone_start_time}
                        <span>
                          {milestone_status === 0 && `(${(getRangeDates(moment().format("YYYY-MM-DD"), milestone_start_time).length - 1)}天后开始)`}
                        </span>
                      </p>
                      <p>
                        结束时间：{milestone_end_time}
                        <span>
                          {milestone_status === 1 && `(${(getRangeDates(going_date, milestone_end_time).length - 1)}天后完成)`}
                        </span>
                      </p>
                      {
                        milestone_status === -1 && <p>已延期至：{moment().format("YYYY-MM-DD")}({`${getRangeDates(milestone_end_time, delay_date).length - 1}天`})</p>
                      }
                    </>}
                  >
                    {
                      milestone_status === 1
                        ? <div
                          style={{
                            width: avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1),
                            backgroundColor: beforeToday ? milestoneStatusColorMap[milestone_status] : '#d6e1fd',
                            marginLeft: leftW,
                            cursor: 'pointer',
                            height: 20
                          }}
                        >
                          {
                            !beforeToday && <div
                              style={{
                                width: avW * (getRangeDates(milestone_start_time, going_date).length - 1),
                                backgroundColor: milestoneStatusColorMap[milestone_status],
                                height: 20
                              }}
                            />
                          }
                        </div>
                        : milestone_status === -1
                          ? <div
                            style={{
                              width: avW * (getRangeDates(milestone_start_time, delay_date).length - 1),
                              backgroundColor: milestoneStatusColorMap[milestone_status],
                              marginLeft: leftW,
                              cursor: 'pointer',
                              height: 20
                            }}
                          />
                          : <div
                            style={{
                              width: avW * (getRangeDates(milestone_start_time, milestone_end_time).length - 1),
                              border: milestone_status === 0 ? '1px dashed #ccc' : 'none',
                              backgroundColor: milestoneStatusColorMap[milestone_status],
                              height: 20,
                              marginLeft: leftW,
                              cursor: 'pointer'
                            }}
                          />
                    }
                  </Popover>
                </div>
              })
            }
          </div>
        </div>
      </ul>
    </Spin>
  </Modal>
};

export default GanttModal;