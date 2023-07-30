import { HelperSystem } from './util/Helper.system'
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import { IUserBirthday } from './entities/IUserBirthday'

const system = new HelperSystem();

const findbirthday_newyork = async () => {
    let isTodayHaveBirthday = await system.isStillHaveBirthday_today_newyork()
    console.log('isTodayHaveBirthday', isTodayHaveBirthday)

    let isYesterdayHaveBirthday = await system.isStillHaveBirthday_yesterday_newyork()
    console.log('isYesterdayHaveBirthday', isYesterdayHaveBirthday)

    let this_month = moment_timezone().tz("America/New_York").format('MM')
    let this_day = moment_timezone().tz("America/New_York").format('DD')
    let total_day_onthis_month = moment_timezone().tz("America/New_York").daysInMonth()
    let total_day_onlast_month = moment().subtract(1, 'months').endOf('month').tz("America/New_York").daysInMonth()

    console.log('this_day', this_day, 'this_month', this_month, 'total_day_onthis_month', total_day_onthis_month, 'total_day_onlast_month', total_day_onlast_month)

    if (isTodayHaveBirthday) {
        // system.executeData
        let userNewYork = await system.getBirthdayData_newyork()
        // console.log('userNewYork', userNewYork)
        let execute_newyork = await system.executeData(userNewYork, 'today')
        console.log('execute_newyork', execute_newyork)
    }

    // return new Promise(async (resolve) => {
    //     const sql_newyork = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
    //     const params: any[] = [];
    //     const user_newyork: IUserBirthday[] = await system.query(sql_newyork, params);
    //     // console.log(user_newyork)
    //     user_newyork.map((userVal) => {
    //         if (!userVal.birthdayStatus) {

    //             let user_month = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('MM')
    //             let user_day = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('DD')
    //             console.log('user_day', user_day, 'user_month', user_month)
    //             if (this_day === user_day) {

    //             }

    //         }
    //     })
    // })
}

findbirthday_newyork()

const timer = setInterval(() => {
    // process.stdout.write('New_York  ' + moment_timezone().tz("America/New_York").format('D. MMMM YYYY H:mm:ss') + "  |  Melbourne  " + moment_timezone().tz("Australia/Melbourne").format('D. MMMM YYYY H:mm:ss') + "\r");
}, 1000)

const second_timer = setInterval(() => {

}, 1000)


function exitHandler(options: any, exitCode: any) {
    clearInterval(timer)
    clearInterval(second_timer)
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}


process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

