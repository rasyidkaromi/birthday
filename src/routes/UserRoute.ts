import { Application, Router, NextFunction, Request, Response } from 'express';
// import { databaseConnection, CacheData } from './database';
import { IUser } from '../entities/IUser';
import { UserRepository } from "../repository/UserRepository";


class UserRoute {
    public router: Router = Router();
    private keysPath = '/user/';
    private generateuser = '/generateuser/';
    private reset = '/reset/';
    private homePath = '/';
    private user: UserRepository
    constructor() {
        this.user = new UserRepository;
    }

    routes = () => {
        this.router.get(this.homePath, this.getHome)
        this.router.get(this.keysPath, this.getAllUser)

        this.router.get(this.generateuser, this.genUser)
        this.router.get(this.reset, this.resetData)

        this.router.get(this.keysPath + ':email', this.getUserbyEmail)
        this.router.put(this.keysPath + `:email`, this.setSingleUser)
        this.router.post(this.keysPath, this.newUser)
        this.router.delete(this.keysPath, this.deleteUser)
        return this.router;
    }
    private getHome = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).send({ data: 'Servers Ready' });
        } catch (e) {
            next(e);
        }
    }

    private getAllUser = async (req: Request, res: Response, next: NextFunction) => {
        this.user.getAll((product) => res.json(product));
    }

    private getUserbyEmail = async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.params.email;
        if (!email) {
            res.status(404).send();
        } else {
            this.user.getbyEmail(email, (userData) => {
                if (userData) {
                    res.json(userData);
                } else {
                    res.status(404).send();
                }
            });
        }
    }

    private setSingleUser = async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.params.email;
        const user: IUser = req.body;
        if (!email) {
            res.status(404).send();
        } else {
            this.user.putbyEmail(email, user, (data) => {
                if (data) {
                    res.json(data);
                } else {
                    res.status(404).send();
                }
            });
        }
    }

    private newUser = async (req: Request, res: Response, next: NextFunction) => {
        const user: IUser = req.body;
        console.log(user)

        this.user.create(user, (id) => {
            if (id) {
                res.json(id);
            } else {
                res.status(400).send();
            }
        });
    }

    private deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = +req.params.id;
        this.user.delete(id, (notFound) => {
            if (notFound) {
                res.status(404).send();
            } else {
                res.status(204).send();
            }
        });
    }

    private genUser = async (req: Request, res: Response, next: NextFunction) => {
        await this.user.genUser()
        res.status(200).send();
    }
    private resetData = async (req: Request, res: Response, next: NextFunction) => {
        let data = await this.user.resetAll()
        res.status(200).send(data);
    }
}

const routes = async (app: Application) => {
    const newRoute = new UserRoute().routes()
    app.use('/', newRoute);
};

export {
    routes,
    UserRoute
}