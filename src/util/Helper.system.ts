import moment from 'moment';
import moment_timezone from 'moment-timezone';
import sqlite3 from "sqlite3";
import axios from 'axios';

import { db_system } from '../database/db.system'
import { IUserBirthday } from '../entities/IUserBirthday'

const Promiseseries = function series(arrayOfPromises: any[]) {
    var results: any[] = [];
    return arrayOfPromises.reduce(function (seriesPromise, promise) {
        return seriesPromise.then(function () {
            return promise
                .then(function (result: any) {
                    results.push(result);
                })
                .catch((error: any) => {
                    results.push(error);
                })
        });
    }, Promise.resolve()).then(function () {
        return results;
    });
};

class HelperSystem {
    private db: sqlite3.Database;
    constructor() {
        this.db = db_system;
    }

    async executeData(userData: IUserBirthday[], type: any) {
        let count = 0
        switch (type) {
            case 'today':
                return new Promise((resolve) => {
                    for (let i = 0; i < userData.length; i++) {
                        axios.post("http://localhost:3030/send-email/", {
                            "email": userData[i].email,
                            "message": `Hey, ${userData[i].firstName} ${userData[i].lastName} it’s your birthday`
                        }).then((response) => {
                            this.queryUpdate(userData[i].userId, (result) => {
                                count = count + 1
                                if (count == userData.length) {
                                    resolve('finish')
                                }
                            })
                        }).catch((err) => {
                            count = count + 1
                            if (count == userData.length) {
                                resolve('finish')
                            }
                        });
                    }
                })
            case 'yesterday':
                return new Promise((resolve) => {
                    for (let i = 0; i < userData.length; i++) {
                        axios.post("http://localhost:3030/send-email/", {
                            "email": userData[i].email,
                            "message": `Hey, ${userData[i].firstName} ${userData[i].lastName}, yesterday it’s your birthday`
                        }).then((response) => {
                            this.queryUpdate(userData[i].userId, (result) => {
                                count = count + 1
                                if (count == userData.length) {
                                    resolve('finish')
                                }
                            })
                        }).catch((err) => {
                            count = count + 1
                            if (count == userData.length) {
                                resolve('finish')
                            }
                        });
                    }
                })
        }
    }


    async query(sql: string, params: any[] = []) {
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

    queryUpdate(id: number, callback: (notFound: boolean) => void) {
        const sql = "UPDATE birthdayStatus SET birthdayStatus = ? WHERE userId = ?";
        const params = [1, id];
        this.db.run(sql, params, function (err) {
            callback(this.changes === 1);
        });
    }

    /**
     * 
     * @returns boolean, check if today is have user birthday for new-york time-zone
     */
    isStillHaveBirthday_today_newyork() {
        return new Promise<any>(async (resolve) => {
            const sql_newyork = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
            const this_day = moment_timezone().tz("America/New_York").format('DD');
            const this_month = moment_timezone().tz("America/New_York").format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_newyork, params);
            let count = 0

            let databirthdayToday_newyork: any[] = []
            if (user_newyork.length == 0) resolve(databirthdayToday_newyork)
            for (let i = 0; i < user_newyork.length; i++) {
                count = count + 1
                if (!user_newyork[i].birthdayStatus) {
                    let user_day = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("America/New_York").format('DD');
                    let user_month = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("America/New_York").format('MM');
                    if (user_day == this_day && user_month == this_month) {
                        databirthdayToday_newyork.push(user_newyork[i])
                        if (count == user_newyork.length) {
                            resolve(databirthdayToday_newyork)
                        }
                    } else {
                        if (count == user_newyork.length) {
                            resolve(databirthdayToday_newyork)
                        }
                    }
                } else {
                    if (count == user_newyork.length) {
                        resolve(databirthdayToday_newyork)
                    }
                }

            }
        })
    }

    /**
     * 
     * @returns boolean, check if yesterday is have user birthday for new-york time-zone
     */
    isStillHaveBirthday_yesterday_newyork() {
        return new Promise<any>(async (resolve) => {
            const sql_newyork = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "New York"`;
            const this_day = moment_timezone().tz("America/New_York").format('DD');
            const this_month = moment_timezone().tz("America/New_York").format('MM');
            const date_onlast_month = moment_timezone().tz("America/New_York").subtract(1, 'months').endOf('month').tz("America/New_York").daysInMonth().toString();
            const month_last = moment_timezone().tz("America/New_York").subtract(1, 'month').format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_newyork, params);
            let count = 0

            let databirthdayYesterday_newyork: any[] = []
            // if this day in new day on the month it will be check yesterday for last month Date
            if (this_day == '01') {
                if (user_newyork.length == 0) resolve(databirthdayYesterday_newyork)
                for (let i = 0; i < user_newyork.length; i++) {
                    count = count + 1
                    if (!user_newyork[i].birthdayStatus) {
                        let user_day = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("America/New_York").format('DD');
                        let user_month = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("America/New_York").format('MM');
                        if (user_day == date_onlast_month && user_month == user_month) {
                            databirthdayYesterday_newyork.push(user_newyork[i])
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_newyork)
                            }
                        } else {
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_newyork)
                            }
                        }
                    } else {
                        if (count == user_newyork.length) {
                            resolve(databirthdayYesterday_newyork)
                        }
                    }
                }
            } else {
                const yesterday = (Number(this_day) - 1).toString();
                if (user_newyork.length == 0) resolve(databirthdayYesterday_newyork)
                for (let i = 0; i < user_newyork.length; i++) {
                    count = count + 1
                    if (!user_newyork[i].birthdayStatus) {
                        let user_day = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("America/New_York").format('DD');
                        let user_month = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("America/New_York").format('MM');
                        if (user_day == yesterday && user_month == this_month) {
                            databirthdayYesterday_newyork.push(user_newyork[i])
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_newyork)
                            }
                        } else {
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_newyork)
                            }
                        }
                    } else {
                        if (count == user_newyork.length) {
                            resolve(databirthdayYesterday_newyork)
                        }
                    }
                }

            }
        })
    }

    /**
     * 
     * @returns boolean, check if today is have user birthday for melbourne time-zone
     */
    isStillHaveBirthday_today_melbourne() {
        return new Promise<any>(async (resolve) => {
            const sql_melbourne = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "Melbourne"`;
            const this_day = moment_timezone().tz("Australia/Melbourne").format('DD');
            const this_month = moment_timezone().tz("Australia/Melbourne").format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_melbourne, params);
            let count = 0
            let databirthdayToday_melbourne: any[] = []
            if (user_newyork.length == 0) resolve(databirthdayToday_melbourne)
            for (let i = 0; i < user_newyork.length; i++) {
                count = count + 1
                if (!user_newyork[i].birthdayStatus) {
                    let user_day = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("Australia/Melbourne").format('DD');
                    let user_month = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("Australia/Melbourne").format('MM');
                    if (user_day == this_day && user_month == this_month) {
                        databirthdayToday_melbourne.push(user_newyork[i])
                        if (count == user_newyork.length) {
                            resolve(databirthdayToday_melbourne)
                        }
                    } else {
                        if (count == user_newyork.length) {
                            resolve(databirthdayToday_melbourne)
                        }
                    }
                } else {
                    if (count == user_newyork.length) {
                        resolve(databirthdayToday_melbourne)
                    }
                }
            }
        })
    }

    /**
     * 
     * @returns boolean, check if yesterday is have user birthday for melbourne time-zone
     */
    isStillHaveBirthday_yesterday_melbourne() {
        return new Promise<any>(async (resolve) => {
            const sql_melbourne = `SELECT * FROM user us INNER JOIN birthdayStatus bs on us.id = bs.userId WHERE location = "Melbourne"`;
            const this_day = moment_timezone().tz("Australia/Melbourne").format('DD');
            const this_month = moment_timezone().tz("Australia/Melbourne").format('MM');
            const date_onlast_month = moment_timezone().tz("Australia/Melbourne").subtract(1, 'months').endOf('month').tz("Australia/Melbourne").daysInMonth().toString();
            const month_last = moment_timezone().tz("Australia/Melbourne").subtract(1, 'month').format('MM')
            const params: any[] = [];
            const user_newyork: IUserBirthday[] = await this.query(sql_melbourne, params);
            let count = 0

            let databirthdayYesterday_melbourne: any[] = []
            // if this day in new day on the month it will be check yesterday for last month Date
            if (this_day == '01') {
                if (user_newyork.length == 0) resolve(databirthdayYesterday_melbourne)
                for (let i = 0; i < user_newyork.length; i++) {
                    count = count + 1
                    if (!user_newyork[i].birthdayStatus) {
                        let user_day = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("Australia/Melbourne").format('DD');
                        let user_month = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("Australia/Melbourne").format('MM');
                        if (user_day == date_onlast_month && user_month == user_month) {
                            databirthdayYesterday_melbourne.push(user_newyork[i])
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_melbourne)
                            }
                        } else {
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_melbourne)
                            }
                        }
                    } else {
                        if (count == user_newyork.length) {
                            resolve(databirthdayYesterday_melbourne)
                        }
                    }
                }
            } else {
                const yesterday = (Number(this_day) - 1).toString();
                if (user_newyork.length == 0) resolve(databirthdayYesterday_melbourne)
                for (let i = 0; i < user_newyork.length; i++) {
                    count = count + 1
                    if (!user_newyork[i].birthdayStatus) {
                        let user_day = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("Australia/Melbourne").format('DD');
                        let user_month = moment_timezone(Number(user_newyork[i].birthdayDate)).tz("Australia/Melbourne").format('MM');
                        if (user_day == yesterday && user_month == this_month) {
                            databirthdayYesterday_melbourne.push(user_newyork[i])
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_melbourne)
                            }
                        } else {
                            if (count == user_newyork.length) {
                                resolve(databirthdayYesterday_melbourne)
                            }
                        }
                    } else {
                        if (count == user_newyork.length) {
                            resolve(databirthdayYesterday_melbourne)
                        }
                    }
                }

            }


        })
    }

}

export {
    HelperSystem
}
