import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import moment from 'moment';
import moment_timezone from 'moment-timezone';
import { IUser } from '../entities/IUser'


class Helper {
    constructor() { }
    private generate_RandonBirthDay() {
        /**
         * random switch for generate 3 deferent time
         */
        const rand_Time = Math.floor(Math.random() * 3) + 1;
        let month = moment().format('MM');
        let day = moment().format('DD');
        let years = Math.floor(Math.random() * (2010 - 1990 + 1) + 1990); // random years beetwen 1990 - 2010
        let dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
        switch (rand_Time) {
            case 1: // today
                return dateTime.toString()
            case 2: // yesterday
                month = moment().subtract(1, 'days').format('MM');
                day = moment().subtract(1, 'days').format('DD');
                dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
                return dateTime.toString()
            case 3: // tommorow
                month = moment().add(2, 'days').format('MM');
                day = moment().add(2, 'days').format('DD');
                dateTime = moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf();
                return dateTime.toString();
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
                return ''
        }
    }

    generate_RandomUserData_Max() {
        return new Promise<IUser[]>((resolve) => {
            let dataUser: IUser[] = [];
            let count = 0;
            let totalCount = 20;
            for (let i = 0; i < totalCount; i++) {
                const shortNames = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
                    separator: '-',
                    length: 3
                });
                let emailData = `${shortNames.split('-')[0]}.${shortNames.split('-')[1]}@${shortNames.split('-')[2]}.com`
                let birthDay = this.generate_RandonBirthDay()
                let data = {
                    firstName: shortNames.split('-')[0],
                    lastName: shortNames.split('-')[1],
                    birthdayDate: birthDay,
                    email: emailData,
                    location: this.generate_RandomLocation(),
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

