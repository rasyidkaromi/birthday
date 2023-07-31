import { HelperSystem } from './util/Helper.system'
// import moment from 'moment';
import moment_timezone from 'moment-timezone';
// import { IUserBirthday } from './entities/IUserBirthday'

const system = new HelperSystem();

console.log('SYSTEM SERVER READY...')

const setBirthdayToday_newyork = async () => {
    let isTodayHaveBirthday_newyork = await system.isStillHaveBirthday_today_newyork()
    if (isTodayHaveBirthday_newyork.length > 0) {
        let execute_newyork_today = await system.executeData(isTodayHaveBirthday_newyork, 'today')
        setBirthdayToday_newyork()
    }
}

const setBirthdayYesterday_newyork = async () => {
    let isYesterdayHaveBirthday_newyork = await system.isStillHaveBirthday_yesterday_newyork()
    if (isYesterdayHaveBirthday_newyork.length > 0) {
        let execute_newyork_yesterday = await system.executeData(isYesterdayHaveBirthday_newyork, 'yesterday')
        setBirthdayYesterday_newyork()
    }
}



const setBirthdayToday_melbourne = async () => {
    let isTodayHaveBirthday_melbourne = await system.isStillHaveBirthday_today_melbourne()
    if (isTodayHaveBirthday_melbourne.length > 0) {
        let execute_melbourne_today = await system.executeData(isTodayHaveBirthday_melbourne, 'today')
        setBirthdayToday_melbourne()
    }

}

const setBirthdayYesterday_melbourne = async () => {
    let isYesterdayHaveBirthday_melbourne = await system.isStillHaveBirthday_yesterday_melbourne()
    if (isYesterdayHaveBirthday_melbourne.length > 0) {
        let execute_melbourne_yesterday = await system.executeData(isYesterdayHaveBirthday_melbourne, 'yesterday')
        setBirthdayYesterday_melbourne()
    }
}

// setBirthdayToday_newyork()
// setBirthdayYesterday_newyork()
// setBirthdayToday_melbourne()
// setBirthdayYesterday_melbourne()

const timer = setInterval(() => {
    let newyorkTime_nine = moment_timezone().tz("America/New_York").format('HH:mm:ss');
    let melbourneTime_nine = moment_timezone().tz("Australia/Melbourne").format('HH:mm:ss');
    if (newyorkTime_nine == '09:00:00') {
        setBirthdayToday_newyork()
        setBirthdayYesterday_newyork()
    }
    if (melbourneTime_nine == '09:00:00') {
        setBirthdayToday_melbourne()
        setBirthdayYesterday_melbourne()
    }

}, 1000)


function exitHandler(options: any, exitCode: any) {
    clearInterval(timer)
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}


process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

