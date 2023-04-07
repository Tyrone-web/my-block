import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from "iron-session/next";
import request from 'service/fetch';
import { ironOptions } from 'config/index';
import { ISession } from '..';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity';


const login = async function (req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { phone, verifyCode, identity_type: identityType } = req.body;

    const db = await prepareConnection();

    const userRepo = db.getRepository(User);
    const userAuthRepo = db.getRepository(UserAuth)

    const users = await userRepo.find();

    // if (session.verifyCode === verifyCode) {
    if ('0000' === String(verifyCode)) {
        console.log(verifyCode, 'verifyCode');

        // 验证码正确，查找user_auths表中的identity_type是否有记录
        // const userAuths = await userAuthRepo.findOne({
        //     // select: {
        //     //     identity_type: identityType,
        //     //     identityfiler: phone
        //     // },
        //     relations: ['user']
        // })
        const userAuths = await userAuthRepo.find();
        const hasUserAuth = userAuths.find(item => item.identity_type === identityType && item.identityfiler === phone)

        if (hasUserAuth) {
            // 已存在的用户
            console.log(hasUserAuth, '11111');
        } else {
            // 注册新用户
            const user = new User();
            user.nickname = `user_${Math.floor(Math.random() * 10000)}`;
            user.avatar = '/images/avatar.jpg';
            user.job = '暂无';
            user.introduce = '暂无';

            const userAuth = new UserAuth();
            userAuth.identity_type = identityType;
            userAuth.identityfiler = phone;
            userAuth.credential = session.verifyCode || '0000';
            userAuth.user = user;

            const resUserAuth = await userAuthRepo.save(userAuth);

            console.log(resUserAuth, '2222');
        }

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
