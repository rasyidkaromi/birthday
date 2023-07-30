import express, { Application, Router, NextFunction, Request, Response } from 'express';
const app = express();
app.use(express.json());

const PORT = 3030

const send_200 = (req: Request, res: Response, next: NextFunction) => {
    const time = new Date()
    res.status(200).json(
        {
            "status": "sent",
            "sentTime": time
        }
    );
}

const error_500 = (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json(
        {
            "message": "Server encountered some errors, please try again later"
        }
    );
}

const error_502 = (req: Request, res: Response, next: NextFunction) => {
    res.status(502).send(`<html><head>
    <title>502 Proxy Error</title>
  </head><body>
    <h1>Proxy Error</h1>
    <p>The proxy server received an invalid
      response from an upstream server.<br />
      The proxy server could not handle the request<p>Reason: <strong>Error
          reading from remote server</strong></p></p>
    <hr>
    <address>Apache/2.4.41 (Ubuntu) Server at
      email-service.digitalenvision.com.au Port 443</address>
  </body></html>`);
}

// check req data for response status 400
const check_request = (req: Request) => {
    let data = req.body
    return new Promise((resolve) => {
        if (!data.message) {
            resolve({
                status: 'error',
                type: 'message',
                data: {
                    "value": data,
                    "path": "message",
                    "type": "required",
                    "errors": [
                        "message is a required field"
                    ],
                    "params": {
                        "path": "message"
                    },
                    "inner": [],
                    "name": "ValidationError",
                    "message": "message is a required field"
                }
            })
        } else
            if (!data.email) {
                resolve({
                    status: 'error',
                    type: 'email',
                    data: {
                        "value": data,
                        "path": "email",
                        "type": "required",
                        "errors": [
                            "email is a required field"
                        ],
                        "params": {
                            "path": "email"
                        },
                        "inner": [],
                        "name": "ValidationError",
                        "message": "email is a required field"
                    }
                })
            } else {
                resolve({
                    status: 'ok',
                })
            }
    })
}

app.post("/send-email", async (req: Request, res: Response, next: NextFunction) => {
    
    const rand_Time = Math.floor(Math.random() * 3) + 1;
    const rand_Func = Math.floor(Math.random() * 3) + 1;
    const resCheck : any = await check_request(req)
    if (resCheck.status == 'error') {
        setTimeout(() => {
            res.status(400).json(resCheck.data)
        }, rand_Time * 1000)
    } else {
        setTimeout(() => {
            if (rand_Func == 1) {
                console.log('OPEN send-email CODE 200', req.body.email, req.body.message)
                send_200(req, res, next)
            }
            if (rand_Func == 2) {
                error_500(req, res, next)
            }
            if (rand_Func == 3) {
                error_502(req, res, next)
            }
        }, rand_Time * 1000)
    }
});

app.listen(PORT, () => {
    console.log("Email Server running on port", PORT);
});

