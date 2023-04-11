import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from "iron-session/next";
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from '..';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity';
import { setCookie } from 'utils/index';

const getLoginResult = (res: any, message: string, data: any, code = 0) => {
    return res.status(200).json({
        code,
        msg: message,
        data
    });
}

const login = async function (req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { phone, verifyCode, identity_type: identityType } = req.body;

    const cookies = Cookie.fromApiRoute(req, res);
    const db = await prepareConnection();
    const userAuthRepo = db.getRepository(UserAuth)

    if ('0000' === String(verifyCode)) {
        // 验证码正确，查找数据库user_auths表中的identity_type是否有记录
        const userAuth = await userAuthRepo.findOne({
            where: {
                identity_type: identityType,
                identityfiler: phone
            },
            relations: ['user']
        });
        // 已存在的用户
        if (userAuth) {
            const user = userAuth?.user;
            const { id, nickname, avatar } = user;

            // 保存当前用户信息到session中
            session.id = id;
            session.nickname = nickname;
            session.avatar = avatar;

            await session.save();
            // 保存当前用户信息到cookie中
            setCookie(cookies, user);

            return getLoginResult(res, '登录成功', { userId: id, nickname, avatar });
        }

        // 数据库中不存在该用户则直接注册新用户 
        const user = new User();
        user.nickname = `user_${Math.floor(Math.random() * 10000)}`;
        user.avatar = '/images/avatar.jpg';
        user.job = '暂无';
        user.introduce = '暂无';

        // 新建一个userAuth
        const newUserAuth = new UserAuth();
        newUserAuth.identity_type = identityType;
        newUserAuth.identityfiler = phone;
        newUserAuth.credential = session.verifyCode || '0000';
        newUserAuth.user = user;

        // 将新的用户信息写入数据库中
        await userAuthRepo.save(newUserAuth);

        // 将当前的信息保存到session中
        const { id, nickname, avatar } = user;

        session.id = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();

        // 保存当前用户信息到cookie中
        setCookie(cookies, user);

        return getLoginResult(res, '注册成功', { userId: id, nickname, avatar });
    }

    // 验证码错误
    return getLoginResult(res, '验证码错误', {}, -1);
};

export default withIronSessionApiRoute(login, ironOptions);
