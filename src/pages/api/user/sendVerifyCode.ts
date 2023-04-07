import { NextApiRequest, NextApiResponse } from 'next';
import md5 from 'md5';
import { format } from 'date-fns';
import { encode } from 'js-base64';
import { withIronSessionApiRoute } from "iron-session/next";
import request from 'service/fetch';
import { ironOptions } from 'config/index';
import { ISession } from '..';

// 使用云通讯的短信平台实现短信获取
const ACCOUNT_ID = '8aaf070870e20ea10171161facd01d94';
const AUTH_TOKEN = 'c272bd1046614e04bea650a3b87a0253';
const BASE_URL = 'https://app.cloopen.com:8883';
const APP_ID = '8aaf070870e20ea10171161fad2d1d9a';
const EXPIRE_MINUTE = '5';

const verifyCode = async function (req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { to, templateId } = req.body;
    const nowDate = format(new Date(), 'yyyyMMddHHmmss');
    const sigParameter = md5(`${ACCOUNT_ID}${AUTH_TOKEN}${nowDate}`);
    const authorization = encode(`${ACCOUNT_ID}:${nowDate}`);
    const url = `${BASE_URL}/2013-12-26/Accounts/${ACCOUNT_ID}/SMS/TemplateSMS?sig=${sigParameter}`;
    // const verifyCode = String(Math.floor(Math.random() * (9999 - 1000)) + 1000);
    const verifyCode = '0000' // 目前容联云通信的测试模板的内容都是固定的，验证码0000，因此这里的验证码固定写入0000

    const response = await request.post(url, {
        to,
        appId: APP_ID,
        templateId,
        datas: [verifyCode, EXPIRE_MINUTE]
    }, {
        headers: {
            Authorization: authorization,
        }
    });

    const { statusCode, statusMsg } = response as Record<string, any>;

    if (statusCode === '000000') {
        session.verifyCode = verifyCode;
        await session.save();

        return res.status(200).json({
            code: 0,
            msg: statusMsg,
        });
    }

    return res.status(200).json({
        code: statusCode,
        msg: statusMsg
    });
};

export default withIronSessionApiRoute(verifyCode, ironOptions);

