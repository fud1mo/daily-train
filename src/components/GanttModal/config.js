import moment from 'moment';

export const milestoneStatusMap = {
    '0': '待开始',
    '-1': '已延期',
    '1': '进行中',
    '2': '已完成'
};

export const milestoneStatusColorMap = {
    '0': '#a9a9a9',
    '-1': '#ffa6a7',
    '1': "#3c75f5",
    '2': '#86ed86'
};

export const getRangeDates = (startDate, endDate) => {
    let dayList = [];
    let sDate = moment(startDate);
    let eDate = moment(endDate);
    dayList.push(sDate.format("YYYY-MM-DD"));
    while (sDate.add(1, 'days').isBefore(eDate)) {
        dayList.push(sDate.format("YYYY-MM-DD"));
    }
    dayList.push(eDate.format("YYYY-MM-DD"));
    return dayList;
};

export const getWeeks = (arr, len) => {
    const newArr = [];
    for (let i = 0; i < arr.length; i += len) {
        newArr.push(arr.slice(i, i + len))
    }
    return newArr;
}