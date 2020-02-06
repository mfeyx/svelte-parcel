import { writable } from 'svelte/store';
import ls from 'local-storage';

const user = writable('');

const userStore = {

  subscribe: user.subscribe,

  setUser: (data) => {
    user.set(data);
    return data;
  },

  addUser: userData => {
    const newUser = {
      ...userData
    };
    user.update(items => {
      return [newUser, ...items];
    });
  },

  updateUser: (id, userData) => {
    user.update(items => {
      const userIndex = items.findIndex(i => i.id === id);
      const updatedUser = { ...items[userIndex], ...userData };
      const updatedUsers = [...items];
      updatedUsers[userIndex] = updatedUser;
      return updatedUsers;
    });
  },

  removeUser: id => {
    user.update(items => {
      return items.filter(i => i.id !== id);
    });
  },

  logoutUser: () => {
    return ls.remove('jwt');
  }

};

export default userStore;
