import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from "iron-session/next";
import request from 'service/fetch';
import { ironOptions } from 'config/index';
import { ISession } from '..';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity';


const login = async function (req: NextApiRequest & ISession, res: NextApiResponse) {
    const { verifyCode } = req.session;
    const { phone, verifyCode: inputVerifyCode } = req.body;

    const db = await prepareConnection();
    const userRepo = db.getRepository(User);

    if (verifyCode === inputVerifyCode) {
        return res.status(200).json({
            code: 0,
        });
    }

    return res.status(200).json({
        code: -1,
        msg: '验证码错误'
    });
};

export default withIronSessionApiRoute(login, ironOptions);
