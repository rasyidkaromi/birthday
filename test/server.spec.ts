import { app, listend } from '../src/server.api';
import request from 'supertest';
import { sql, dbLite, databaseClear } from '../src/database/db';
import moment from 'moment';

const consoleSpy = jest.spyOn(console, 'log').mockImplementation()


describe('Aplication Rest Api Test', () => {

    const month = moment().format('MMMM');
    const day = moment().format('D');
    const years = Math.floor(Math.random() * (2010 - 1990 + 1) + 1990) // random years beetwen 1990 - 2010
    const dateTime = new Date(`${month} ${day}, ${years} 15:00:00`).getTime();
    const email = "underTest@test.com";

    beforeAll(done => {
        done()
    })
    afterAll(done => {
        done()
        listend.close()
    })

    afterEach(async () => await databaseClear());

    describe('GET HTTP methods Test', () => {
        it('GET "/" | should recieved Servers Ready from getHome method', async () => {
            const res = await request(app).get('/')
            expect(res.status).toBe(200)
            expect(res.body.data).toEqual('Servers Ready');

        })
    })

    describe('POST HTTP methods Test', () => {
        it('POST "/" | should POST user method', async () => {
            const res = await request(app)
                .post('/user/')
                .send({
                    "firstName": "underTest",
                    "lastName": "underTest",
                    "email": email,
                    "birthdayDate": dateTime.toString(),
                    "location": "New York",
                    "anniversaryDate": ""
                })
            expect(res.status).toBe(200)
        })
    })

    describe('PUT HTTP methods Test', () => {
        it('POST "/" | should POST user method', async () => {
            const res = await request(app)
                .put('/user/:' + email)
                .send({
                    "firstName": "underTest_update",
                    "lastName": "underTest_update",
                })
            expect(res.status).toBe(200)
        })
    })
})