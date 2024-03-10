// Trong mutation.js
export default {
  SET_LOGIN_STATUS(state, loginStatus) {
    state.loginStatus = loginStatus;
  },
  SET_POSTS(state, posts) {
    state.posts = posts;
  },
  SET_PAGES(state, pages) {
    state.pages = pages;
  },
  SET_PAGES_INFO(state, newPage) {
    state.pages_info.push(newPage);
  },
 
 
  SET_TOKEN(state, token) {
    state.token = token;
  },
};
