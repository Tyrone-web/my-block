export type IUserInfo = {
    id?: number;
    userId?: number | null;
    nickname?: string;
    avatar?: string;
}

export interface IUserStore {
    userInfo: IUserInfo;
    // eslint-disable-next-line no-unused-vars
    setUserInfo: (value: IUserInfo) => void; // setUserInfo
}

const userStore = (): IUserStore => {
    return {
        userInfo: {},
        setUserInfo: function (value) {
            this.userInfo = value
        }
    }
}

export default userStore;