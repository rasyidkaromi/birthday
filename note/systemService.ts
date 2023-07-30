import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import moment from 'moment';
import moment_timezone from 'moment-timezone';


function generateRandomDate(from: Date, to: Date) {
    let newDate = new Date(
        from.getTime() +
        Math.random() * (to.getTime() - from.getTime()),
    );
    return {
        date: newDate,
        time: newDate.getTime()
    }
}

console.log(
    generateRandomDate(new Date(1990, 0, 1), new Date()),
);

const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    separator: '-',
    length: 2
});

console.log(shortName.split('-'))

let dataUser = [{}]
let count = 1
let totalCount = 10000
for (let i = 1; i < totalCount; i++) {
    const shortNames = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        separator: '-',
        length: 2
    });
    let fullName = shortNames.split('-')
    let birthDay = generateRandomDate(new Date(2000, 0, 1), new Date())
    let data = {
        firstName: fullName[0],
        lastName: fullName[1],
        birthdayDate: birthDay.time,
    }
    dataUser.push(data)
    count = count + 1
    if (count == totalCount) {
        console.log(dataUser)
    }
}


// db.run('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, num1 INTEGER NOT NULL, num2 INTEGER NOT NULL)')

// var params = [[1,2],[3,4],[5,6],[7,8]];
// db.serialize(function() {
//     db.run("begin transaction");

//     for (var i = 0; i < params.length; i++) {
//         db.run("insert into data(num1, num2) values (?, ?)", params[i][0], params[i][1]);
//     }

//     db.run("commit");
// });


const stringDate = new Date('May 29, 2019 15:00:00');

console.log(moment().format('YYYY')) // tahun ini


console.log(moment().format('MMMM')) // bulan ini
console.log(moment().subtract(1, 'days').format('MMMM')) // bulan di hari kemarin
console.log(moment().add(1, 'days').format('MMMM')) // bulan di hari besok

console.log(moment().format('D')) // tanggal ini
console.log(moment().subtract(1, 'days').format('D')) // tanggal di hari kemarin
console.log(moment().add(1, 'days').format('D')) // tanggal di hari besok

const fromDate = new Date().getTime()
console.log('fromDate', fromDate) // 1690616256630
console.log('moment(fromDate)', moment(fromDate))
console.log("moment(fromDate).format('YYYY-MM-DD HH:mm:ss')", moment(fromDate).format('YYYY-MM-DD HH:mm:ss'))
console.log('moment().valueOf()', moment().valueOf()) // 1690616256630

console.log('\n')


const date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
const stillUtc = moment.utc(date).toDate();
const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
console.log("local", local)

console.log('\n')

const newYorkTime = moment_timezone(stillUtc).tz("America/New_York").format();
const newYorkTime_inHour = moment_timezone(stillUtc).tz("America/New_York").format('H');
const newYorkTime_inDateNumber = moment_timezone(stillUtc).tz("America/New_York").format('D');
const newYorkTime_inMonthNumber = moment_timezone(stillUtc).tz("America/New_York").format('MMMM');

console.log("newYorkTime", newYorkTime)
console.log("newYorkTime_inHour", newYorkTime_inHour)
console.log("newYorkTime_inDateNumber", newYorkTime_inDateNumber)
console.log("newYorkTime_inMonthNumber", newYorkTime_inMonthNumber)

console.log('\n')

const melbourneTime = moment_timezone(stillUtc).tz("Australia/Melbourne").format();
const melbourneTime_inHour = moment_timezone(stillUtc).tz("Australia/Melbourne").format('H');
console.log("melbourneTime", melbourneTime)
console.log("melbourneTime_inHour", melbourneTime_inHour)

console.log('\n')

console.log(moment().toDate().getTime())

console.log(moment.utc().format('YYYY-MM-DD HH:mm:ss'))


console.log(moment())

console.log(moment().subtract(1, 'days'))
console.log(moment().subtract(1, 'hour'))

console.log(moment().subtract(1, 'days').format("MMM Do YY"))




function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const rndInt = randomIntFromInterval(1990, 2010)
console.log(rndInt)

let month = moment().format('MM');
let day = moment().format('DD');
let years = Math.floor(Math.random() * (2010 - 1990 + 1) + 1990) 
let dateTime = new Date(`${month} ${day}, ${years} 15:00:00`)

console.log(`${month} ${day}, ${years} 12:00:00`)
console.log('dateTime', dateTime)



// local
console.log(moment(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`))

// utc
console.log(moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`))

console.log(moment.utc(`${day}-${month}-${years} 15:00:00`, `DD-MM-YYYY hh:mm:ss`).valueOf())


