import { db } from "../database/db";
import { IUser } from "../entities/IUser";
import { Helper } from '../util/Helper'
import moment from 'moment';

class UserRepository {
  private helper: Helper

  constructor() {
    this.helper = new Helper;
  }

  create = (user: IUser, callback: (id?: number) => void) => {
    const sql = "INSERT INTO user (firstName, lastName, email, birthdayDate, anniversaryDate, location) VALUES (?,?,?,?,?,?)";
    const sql_birthday = "INSERT INTO birthdayStatus (userId, userEmail, birthdayDate, birthdayYear) VALUES (?,?,?,?)";

    const params = [user.firstName, user.lastName, user.email, user.birthdayDate, user.anniversaryDate, user.location];
    db.run(sql, params, function (err) {
      if (err) console.log(err)
      db.run(sql_birthday, [this?.lastID, user.email, user.birthdayDate, moment().format('YYYY').toString().toString()], function (err) {
        if (err) console.log(err)
        callback(this?.lastID);
      });
    })
  }

  get = (id: number, callback: (user?: IUser | unknown) => void) => {
    const sql = "SELECT * FROM user WHERE id = ?";
    const params = [id];
    db.get(sql, params, (_err, row) => callback(row));
  }

  getbyEmail = (email: string, callback: (user?: IUser | unknown) => void) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    const params = [email];

    db.get(sql, params, (_err, row) => callback(row));
  }

  getAll = (callback: (user: IUser[] | unknown) => void) => {
    const sql = "SELECT * FROM user";
    const params: any[] = [];
    db.all(sql, params, (err, rows) => callback(rows));
  }

  put = (id: number, user: IUser, callback: (notFound: boolean) => void) => {
    const sql = "UPDATE user SET firstName = ?, lastName = ? WHERE id = ?";
    const params = [user.firstName, user.lastName, id];
    db.run(sql, params, function (err) {
      callback(this.changes === 0);
    });
  }

  putbyEmail = (email: string, user: IUser, callback: (notFound: boolean) => void) => {
    const sql = "UPDATE user SET firstName = ?, lastName = ? WHERE email = ?";
    const params = [user.firstName, user.lastName, email];
    db.run(sql, params, function (err) {
      callback(this.changes === 0);
    });
  }

  delete = (id: number, callback: (notFound: boolean) => void) => {
    const sql = "DELETE FROM user WHERE id = ?";
    const params = [id];
    db.run(sql, params, function (err) {
      callback(this.changes === 0);
    });
  }

  deletebyEmail = (email: string, callback: (notFound: boolean) => void) => {
    const sql = "DELETE FROM user WHERE email = ?";
    const params = [email];
    db.run(sql, params, function (err) {
      callback(this.changes === 0);
    });
  }

  genUser = async () => {
    let userData = await this.helper.generate_RandomUserData_Max()
    const sql = "INSERT INTO user (firstName, lastName, birthdayDate, anniversaryDate, location, email) VALUES (?,?,?,?,?,?)";
    const sql_birthday = "INSERT INTO birthdayStatus (userId, userEmail, birthdayDate, birthdayYear) VALUES (?,?,?,?)";

    return new Promise((resolve) => {
      let count = 0
      // db.serialize(function () {
        for (let i = 0; i < userData.length; i++) {
          const params = [userData[i].firstName, userData[i].lastName, userData[i].birthdayDate, userData[i].anniversaryDate, userData[i].location, userData[i].email];
          db.run(sql, params, function (err) {
            if (err) console.log(err)
            db.run(sql_birthday, [this?.lastID, userData[i].email, userData[i].birthdayDate, moment().format('YYYY').toString().toString()], function (err) {
              if (err) console.log(err)
              count = count + 1;
              if (count == userData.length) {
                resolve('')
              }
            });
          });
        }
      // })
    })
  }

  resetAll = async () => {
    return new Promise((resolve) => {
      const userReset = "DELETE FROM user";
      const birthdayStatusReset = "DELETE FROM birthdayStatus"
      db.run(userReset, () => {
        db.run(birthdayStatusReset, () => {
          resolve('reset done')
        })
      });
    })
  }

};

export { UserRepository };
