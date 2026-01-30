//simulação de banco para estudo//
import crypto from "crypto";

const users = [];
const refreshTokens = []; // { id(hash), userId, expires }

export const db = {
  users,
  refreshTokens,

  findUserByEmail: (email) => users.find((u) => u.email === email),
  findUserById: (id) => users.find((u) => u.id === id),
  createUser: (user) => {
    users.push(user);
    return user;
  },

  saveRefresh: (record) => refreshTokens.push(record),
  findRefreshByHash: (hash) => refreshTokens.find((t) => t.id === hash),
  removeRefreshByHash: (hash) => {
    const i = refreshTokens.findIndex((t) => t.id === hash);
    if (i !== -1) refreshTokens.splice(i, 1);
  },
  removeAllForUser: (userId) => {
    for (let i = refreshTokens.length - 1; i >= 0; i--) {
      if (refreshTokens[i].userId === userId) refreshTokens.splice(i, 1);
    }
  },
};
