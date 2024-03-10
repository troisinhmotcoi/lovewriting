// Trong action.js
import * as api from '../service';

export default {
  async getLoginStatus({ state }) {
    try {

      return state.loginStatus
    } catch (error) {
      console.error('Error getting login status:', error);
      throw error;
    }
  },

  async getPost1st({ commit }, { loginStatus, privacy }) {
    try {
      console.log(loginStatus)

      if (loginStatus === 'connected') {
        const posts = await api.getPost1st(commit, privacy);
        commit('SET_POSTS', posts.data);
        commit('SET_PAGES', posts.pages);
        commit('SET_PAGES_INFO', { num: 0, link: posts.link0 });

        
        return posts;
      }

    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  async getPostsWithUrl({ commit, state }, { loginStatus, url, privacy, type = '' }) {
    try {
      if (loginStatus === 'connected') {
        if (type == 'prev') {
          state.num--;
          const foundPage = state.pages_info.find(page => page.num === state.num);
          if (foundPage) {
            // Nếu có, cập nhật url
            url = foundPage.link;
          }
        }
        console.log(url)
        const posts = await api.fetchData(url, privacy);
        console.log(url)
        commit('SET_POSTS', posts.data);
        commit('SET_PAGES', posts.pages);

        if (type == 'next'){
          state.num++;
          commit('SET_PAGES_INFO', { num: state.num, link: url });


        }

        return posts;
      }

    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  async getInit({ commit, state }) {
    try {
      let loginStatus = state.loginStatus;
      let login;
      if (!loginStatus || loginStatus.status !== 'connected') {
        loginStatus = await api.initializeFacebookSDK();
        console.log(loginStatus)
        login = await api.loginFB();
        commit('SET_LOGIN_STATUS', login);

      }

      return login;
    } catch (error) {
      console.error('Error initializing Facebook SDK and logging in:', error);
      throw error;
    }
  },

  async deleteItems({ state }, { ids }) {
    console.log(ids)
    try {
      if (!state || !state.token) {
        throw new Error('State or token is undefined.');
      }
      // Call your API or service to delete items using the provided IDs
      await api.deleteItems(ids, state);



    } catch (error) {
      console.error('Error deleting items:', error);
      throw error;
    }
  },
};

