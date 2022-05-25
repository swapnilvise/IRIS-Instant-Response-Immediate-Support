import UserInfo from './../models/userInfo.js';

/**
 * Will find the user by id and will help in login
 * @param {*} query 
 * @returns 
 */
export const search = (query) => {
    const params = {...query};
    return UserInfo.find(params).exec();
}