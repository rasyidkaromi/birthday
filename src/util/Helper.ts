import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import { IUser } from '../entities/IUser'


class Helper {
    constructor() { }
    private generate_RandonBirthDay(loca: string) {
        /**
         * random switch for generate 3 deferent time
         */
        const rand_Time = Math.floor(Math.random() * 2) + 1;
        let month = moment().format('MM');
        let day = moment().format('DD');
        let years = Math.floor(Math.random() * (2010 - 1990 + 1) + 1990); // random years beetwen 1990 - 2010
        let dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
        switch (rand_Time) {
            case 1: // today
                if (loca == 'New York') {
                    month = moment_timezone().tz("America/New_York").format('MM');
                    day = moment_timezone().tz("America/New_York").format('DD');
                    // dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
                    dateTime = moment_timezone(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).tz("America/New_York").valueOf();
                    return dateTime.toString()
                }
                if (loca == 'Melbourne') {
                    month = moment_timezone().tz("Australia/Melbourne").format('MM');
                    day = moment_timezone().tz("Australia/Melbourne").format('DD');
                    dateTime = moment_timezone(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).tz("Australia/Melbourne").valueOf();
                    return dateTime.toString()
                }
            case 2: // yesterday
                if (loca == 'New York') {
                    month = moment_timezone().tz("America/New_York").subtract(1, 'days').format('MM');
                    day = moment_timezone().tz("America/New_York").subtract(1, 'days').format('DD');
                    // dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
                    dateTime = moment_timezone(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).tz("America/New_York").valueOf();
                    return dateTime.toString()
                }
                if (loca == 'Melbourne') {
                    month = moment_timezone().tz("Australia/Melbourne").subtract(1, 'days').format('MM');
                    day = moment_timezone().tz("Australia/Melbourne").subtract(1, 'days').format('DD');
                    // dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
                    dateTime = moment_timezone(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).tz("Australia/Melbourne").valueOf();
                    return dateTime.toString()
                }
            default:
                return dateTime.toString();
        }
    }

    generate_RandomLocation() {
        const rand_Func = Math.floor(Math.random() * 2) + 1;
        switch (rand_Func) {
            case 1:
                return "New York"
            case 2:
                return "Melbourne"
            default:
                return "New York"
        }
    }

    generate_RandomUserData_Max() {
        return new Promise<IUser[]>((resolve) => {
            let dataUser: IUser[] = [];
            let count = 0;
            let totalCount = 1000;
            for (let i = 0; i < totalCount; i++) {
                let loca = this.generate_RandomLocation();
                const shortNames = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
                    separator: '-',
                    length: 3
                });
                let emailData = `${shortNames.split('-')[0]}.${shortNames.split('-')[1]}@${shortNames.split('-')[2]}.com`
                let birthDay = this.generate_RandonBirthDay(loca)
                let data = {
                    firstName: shortNames.split('-')[0],
                    lastName: shortNames.split('-')[1],
                    birthdayDate: birthDay,
                    email: emailData,
                    location: loca,
                    anniversaryDate: ''
                }
                dataUser.push(data)
                count = count + 1
                if (count == totalCount) {
                    resolve(dataUser)
                }
            }
        })
    }

}

export { Helper };

