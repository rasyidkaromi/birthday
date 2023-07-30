import moment from 'moment';
import moment_timezone from 'moment-timezone';
import sqlite3 from "sqlite3";
import axios from 'axios';
import workerpool from "workerpool";

import { db_system } from '../database/db.system'
import { IUserBirthday } from '../entities/IUserBirthday'


class HelperSystem {
    private db: sqlite3.Database;
    private pool: workerpool.WorkerPool

    constructor() {
        this.db = db_system;
        this.pool = workerpool.pool({
            minWorkers: "max",
        });
    }

    processData = async (file: any) => {
        try {
            // const resData = await axios.request<any>({
            //     method: "POST",
            //     url: 'http://localhost:3030/send-email/',
            //     data: {
            //         "email": file.email,
            //         "message": `Hey, ${file.firstName} ${file.lastName} it’s your birthday`
            //     }
            // })
            axios.post("http://localhost:3030/send-email/", {
                "email": file.email,
                "message": `Hey, ${file.firstName} ${file.lastName} it’s your birthday`
            }).then((response) => {
                console.log('processData', response);
            });
            // console.log('processData', resData);
        } catch (e) {
            console.log(e);          // log an errors
            throw e;                 // propagate rejection/error
        }
    }
    processData_late = async (file: any) => {
        try {
            const resData = await axios.request<any>({
                method: "POST",
                url: 'http://localhost:3030/send-email/',
                data: {
                    "email": file.email,
                    "message": `Hey, ${file.firstName} ${file.lastName}, yesterday it’s your birthday`
                }
            })
            console.log('processData_late', resData);
        } catch (e) {
            console.log(e);          // log an error
            throw e;                 // propagate rejection/error
        }
    }
    executeData = async (userData: any[], type: any) => {
        const promiseArray: workerpool.Promise<Promise<void>>[] = [];
        switch (type) {
            case 'today':
                userData.forEach((file: any) => {
                    promiseArray.push(this.pool.exec(this.processData, [file]));
                });
                await Promise.allSettled(promiseArray);
                await this.pool.terminate();
                break;
            case 'yesterday':
                userData.forEach((file: any) => {
                    promiseArray.push(this.pool.exec(this.processData_late, [file]));
                });
                await Promise.allSettled(promiseArray);
                await this.pool.terminate();
                break;
        }
    }
    query = async (sql: string, params: any[] = [],) => {
        return new Promise<any[]>((resolve) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log(err)
                    resolve([])
                }
                resolve(rows)
            });
        })
    }

    /**
     * 
     * @returns boolean, check if today is have user birthday for new-york time-zone
     */
    isStillHaveBirthday_today_newyork() {
        return new Promise<boolean>(async (resolve) => {
            const sql_newyork = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
            const this_day = moment_timezone().tz("America/New_York").format('DD');
            const this_month = moment_timezone().tz("America/New_York").format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_newyork, params);
            let isHaveBirthday: boolean = false;
            let count = 0
            // console.log('this_day', this_day, 'this_month', this_month)
            user_newyork.map((userVal) => {
                count = count + 1
                if (!userVal.birthdayStatus) {
                    let user_day = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('DD');
                    let user_month = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('MM');
                    // console.log('user_day', user_day, 'user_month', user_month)
                    // if(user_day == '01'){
                    //     console.log('OKS FOR 01 date')
                    // }
                    if (user_day == this_day && user_month == this_month) {
                        isHaveBirthday = true
                        resolve(isHaveBirthday)
                    } else {
                        isHaveBirthday = false
                    }
                    if (count == user_newyork.length) {
                        resolve(isHaveBirthday)
                    }
                } else {
                    resolve(false)
                }
            })
        })
    }

    /**
     * 
     * @returns boolean, check if yesterday is have user birthday for new-york time-zone
     */
    isStillHaveBirthday_yesterday_newyork() {
        return new Promise<boolean>(async (resolve) => {
            const sql_newyork = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
            const this_day = moment_timezone().tz("America/New_York").format('DD');
            const this_month = moment_timezone().tz("America/New_York").format('MM');
            const date_onlast_month = moment().subtract(1, 'months').endOf('month').tz("America/New_York").daysInMonth().toString();
            const month_last = moment().subtract(1, 'month').format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_newyork, params);
            let isHaveBirthday: boolean = false;
            let count = 0

            // if this day in new day on the month it will be check yesterday for last month Date
            if (this_day == '01') {
                user_newyork.map((userVal) => {
                    count = count + 1
                    if (!userVal.birthdayStatus) {
                        let user_day = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('DD')
                        let user_month = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('MM')
                        if (user_day == date_onlast_month && user_month == month_last) {
                            isHaveBirthday = true
                            resolve(isHaveBirthday)
                        } else {
                            isHaveBirthday = false
                        }
                        if (count == user_newyork.length) {
                            resolve(isHaveBirthday)
                        }
                    } else {
                        resolve(false)
                    }
                })
            } else {
                const yesterday = (Number(this_day) - 1).toString();
                user_newyork.map((userVal) => {
                    count = count + 1
                    if (!userVal.birthdayStatus) {
                        let user_day = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('DD')
                        let user_month = moment(Number(userVal.birthdayDate)).tz("America/New_York").format('MM')
                        if (user_day == yesterday && user_month == this_month) {
                            isHaveBirthday = true
                            resolve(isHaveBirthday)
                        } else {
                            isHaveBirthday = false
                        }
                        if (count == user_newyork.length) {
                            resolve(isHaveBirthday)
                        }
                    } else {
                        resolve(false)
                    }
                })
            }
        })
    }

    /**
     * 
     * @returns boolean, check if today is have user birthday for melbourne time-zone
     */
    isStillHaveBirthday_today_melbourne() {
        return new Promise<boolean>(async (resolve) => {
            const sql_melbourne = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
            const this_day = moment_timezone().tz("Australia/Melbourne").format('DD');
            const this_month = moment_timezone().tz("Australia/Melbourne").format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_melbourne, params);
            let isHaveBirthday: boolean = false;
            let count = 0
            // console.log('this_day', this_day, 'this_month', this_month)
            user_newyork.map((userVal) => {
                count = count + 1
                if (!userVal.birthdayStatus) {
                    let user_day = moment(Number(userVal.birthdayDate)).tz("Australia/Melbourne").format('DD');
                    let user_month = moment(Number(userVal.birthdayDate)).tz("Australia/Melbourne").format('MM');
                    // console.log('user_day', user_day, 'user_month', user_month)
                    if (user_day == this_day && user_month == this_month) {
                        isHaveBirthday = true
                        resolve(isHaveBirthday)
                    } else {
                        isHaveBirthday = false
                    }
                    if (count == user_newyork.length) {
                        resolve(isHaveBirthday)
                    }
                } else {
                    resolve(false)
                }
            })
        })
    }

    /**
     * 
     * @returns boolean, check if yesterday is have user birthday for melbourne time-zone
     */
    isStillHaveBirthday_yesterday_melbourne() {
        return new Promise<boolean>(async (resolve) => {
            const sql_melbourne = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
            const this_day = moment_timezone().tz("Australia/Melbourne").format('DD');
            const this_month = moment_timezone().tz("Australia/Melbourne").format('MM');
            const date_onlast_month = moment().subtract(1, 'months').endOf('month').tz("Australia/Melbourne").daysInMonth().toString();
            const month_last = moment().subtract(1, 'month').format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_melbourne, params);
            let isHaveBirthday: boolean = false;
            let count = 0

            // console.log('date_onlast_month', date_onlast_month, 'month_last', month_last)

            // if this day in new day on the month it will be check yesterday for last month Date
            if (this_day == '01') {
                user_newyork.map((userVal) => {
                    count = count + 1
                    if (!userVal.birthdayStatus) {
                        let user_day = moment(Number(userVal.birthdayDate)).tz("Australia/Melbourne").format('DD')
                        let user_month = moment(Number(userVal.birthdayDate)).tz("Australia/Melbourne").format('MM')
                        if (user_day == date_onlast_month && user_month == month_last) {
                            isHaveBirthday = true
                            resolve(isHaveBirthday)
                        } else {
                            isHaveBirthday = false
                        }
                        if (count == user_newyork.length) {
                            resolve(isHaveBirthday)
                        }
                    } else {
                        resolve(false)
                    }
                })
            } else {
                const yesterday = (Number(this_day) - 1).toString();
                user_newyork.map((userVal) => {
                    count = count + 1
                    if (!userVal.birthdayStatus) {
                        let user_day = moment(Number(userVal.birthdayDate)).tz("Australia/Melbourne").format('DD')
                        let user_month = moment(Number(userVal.birthdayDate)).tz("Australia/Melbourne").format('MM')
                        if (user_day == yesterday && user_month == this_month) {
                            isHaveBirthday = true
                            resolve(isHaveBirthday)
                        } else {
                            isHaveBirthday = false
                        }
                        if (count == user_newyork.length) {
                            resolve(isHaveBirthday)
                        }
                    } else {
                        resolve(false)
                    }
                })
            }
        })
    }

    getBirthdayData_newyork() {
        return new Promise<IUserBirthday[]>(async (resolve) => {
            const sql_newyork = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York" AND bs.birthdayStatus = 0`;
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_newyork, params);
            resolve(user_newyork)
        })
    }

}

export {
    HelperSystem
}
