import moment from 'moment'

export const showFullDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const fullDate = moment(date).format("D MMM YYYY hh:MM:ss");
    return fullDate;
}