import { ironOptions } from "config";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { ISession } from "..";
import { Cookie } from "next-cookie";
import { clearCookie } from 'utils/index';


const login = async function (req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res);

    // 清除session
    await session.destroy();
    // 清除cookie
    clearCookie(cookies);

    return res.status(200).json({
        code: 0,
        msg: '退出成功',
        data: {},
    });
};

export default withIronSessionApiRoute(login, ironOptions);