/**
 * 生成随机码
 * @param len 随机码长度
 */
export const createRandomCode = (len = 6) => {
    const charset =
        "_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const maxLen = charset.length;
    let ret = "";
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * maxLen);
        ret += charset[randomIndex];
    }
    return ret;
};

const Pt2PIX = (pt) => (pt / 3) * 4;
export const EMU2PIX = (emus) => {
    if (isNaN(emus)) {
        return undefined;
    }

    return Pt2PIX(+emus / 12700);
};
