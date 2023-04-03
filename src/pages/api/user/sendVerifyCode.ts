import { NextApiRequest, NextApiResponse } from 'next';
import md5 from 'md5';
import { format } from 'date-fns';
import { encode } from 'js-base64';
import request from 'service/fetch';

// 使用云通讯的短信平台实现短信获取
const ACCOUNT_ID = '8aaf070870e20ea10171161facd01d94';
const AUTH_TOKEN = 'c272bd1046614e04bea650a3b87a0253';
const BASE_URL = 'https://app.cloopen.com:8883';
const APP_ID = '8aaf070870e20ea10171161fad2d1d9a';
const EXPIRE_MINUTE = '5';


const verifyCode = async function (req: NextApiRequest, res: NextApiResponse) {
    const { to, templateId } = req.body;
    const nowDate = format(new Date(), 'yyyyMMddHHmmss');
    const sigParameter = md5(`${ACCOUNT_ID}${AUTH_TOKEN}${nowDate}`);
    const authorization = encode(`${ACCOUNT_ID}:${nowDate}`);
    const url = `${BASE_URL}/2013-12-26/Accounts/${ACCOUNT_ID}/SMS/TemplateSMS?sig=${sigParameter}`;
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    const resonse = await request.post(url, {
        to,
        templateId,
        appId: APP_ID,
        datas: [verifyCode, EXPIRE_MINUTE]
    }, {
        headers: {
            Authorization: authorization
        }
    });
    return res.status(200).json({
        code: 0,
        data: resonse
    });
};

export default verifyCode;