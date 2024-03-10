// Trong api.js
export async function initializeFacebookSDK() {
  return new Promise((resolve, reject) => {
    // Check if FB object is already available
    if (window.FB) {
      // FB object is available, resolve immediately
      console.log('fb')
      resolve();
    } else {
      // FB object is not available, set up async initialization
      window.fbAsyncInit = function () {
        FB.init({
          appId: '746456420303271',
          xfbml: true,
          version: 'v18.0'
        });
        console.log('tw')
        resolve();
      };
    }

    // Include the Facebook SDK script
    includeFacebookSDKScript();
  });
}

function includeFacebookSDKScript() {
  // Check if the Facebook SDK script is already loaded
  const script = document.getElementById('facebook-jssdk');
  if (!script) {
    const fbScript = document.createElement('script');
    fbScript.id = 'facebook-jssdk';
    fbScript.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.head.appendChild(fbScript);
  }
}

// The rest of your code remains the same
// ...


export function loginFB() {
  return new Promise((resolve, reject) => {
    FB.login((loginResponse) => {
      if (loginResponse.authResponse) {
        console.log('User logged in:', loginResponse);
        resolve(loginResponse.status);
      } else {
        console.log('User cancelled login or did not fully authorize.');
        reject('Login cancelled or not fully authorized.');
      }
    });
  });
}




export async function getPost1st(commit, privacy) {
  console.log(privacy);
  return new Promise((resolve, reject) => {
    FB.getLoginStatus((loginStatus) => {
      if (loginStatus.status === 'connected') {
        const access_token = loginStatus.authResponse.accessToken;
        const user_id = loginStatus.authResponse.userID;
        commit('SET_TOKEN', access_token)
        let apiUrl = `/${user_id}/posts?access_token=${access_token}&fields=id,message,privacy,created_time`;
        // if (privacy) {
        //   apiUrl += `&privacy[value]=${privacy}`;
        // }


        FB.api(apiUrl, (response) => {
          if (response.error) {
            reject(response.error);
          } else {
            // console.log(privacy)
            // console.log('User posts:', response, privacy);

            const filteredPosts = response.data.filter(post => post.privacy && post.privacy.value === privacy);
            // console.log('User posts:', filteredPosts, privacy);
            resolve({
              data: filteredPosts,
              pages: {
                // Add relevant page information here
                next: response.paging.next,
              },
              link0: 'https://graph.facebook.com/v18.0'+apiUrl
            });
          }
        });
      } else {
        console.error('User not connected.');
        reject('User not connected.');
      }
    });
  });
}

function removeStringFromUrl(url, stringToRemove) {
  // Escape special characters in the string to remove
  const escapedString = stringToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression with the escaped string
  const regex = new RegExp(escapedString, 'g');

  // Remove the string from the URL using the replace method
  const modifiedUrl = url.replace(regex, '');

  return modifiedUrl;
}




export async function fetchData(apiEndpoint, privacy) {
  return new Promise((resolve, reject) => {
    let apiUrl = removeStringFromUrl(apiEndpoint, 'https://graph.facebook.com/v18.0');

    // Check if previous parameter should be included
      // Add previous parameter to the URL
      apiUrl += apiUrl.includes('?') ? '&' : '?';

    FB.api(apiUrl, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        const filteredPosts = response.data.filter(post => post.privacy && post.privacy.value === privacy);

        const result = {
          data: filteredPosts,
          pages: {
            // Add relevant page information here
          }
        };

        // Check if there is a next page
        if (response.paging && response.paging.next) {
          result.pages.next = response.paging.next;
        }

     

        resolve(result);
      }
    });

    // Optionally, handle errors and reject the Promise if needed
    // reject(new Error('Some error occurred'));
  });
}


export async function deleteItemsx(ids, state) {
  if (!state || !state.token) {
    throw new Error('State or token is undefined.');
  }
  // Assuming accessToken is defined somewhere in your code
  const accessToken = state.token;

  // Create an array to store promises for each deletion
  const deletionPromises = [];

  // Loop through each postId in the ids array
  ids.forEach((postId) => {
    const apiUrl = `/${postId}?access_token=${accessToken}`;

    // Create a promise for each deletion
    const deletionPromise = new Promise((resolve, reject) => {
      FB.api(apiUrl, 'delete', (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          console.log(`Post ${postId} deleted successfully`);
          resolve(response);
        }
      });
    });

    // Add the promise to the array
    deletionPromises.push(deletionPromise);
  });

  // Use Promise.all to wait for all deletions to complete
  return Promise.all(deletionPromises);
}

export async function deleteItems(ids, state) {
  return new Promise((resolve, reject) => {
    FB.getLoginStatus((loginStatus) => {
      if (loginStatus.status === 'connected') {
        const accessToken = loginStatus.authResponse.accessToken;

        // Create an array to store promises for each deletion
        const deletionPromises = [];

        // Loop through each postId in the ids array
        ids.forEach((postId) => {
          const apiUrl = `/${postId}?access_token=${accessToken}`;

          // Create a promise for each deletion
          const deletionPromise = new Promise((resolve, reject) => {
            FB.api(apiUrl, 'delete', (response) => {
              if (response.error) {
                reject(response.error);
              } else {
                console.log(`Post ${postId} deleted successfully`);
                resolve(response);
              }
            });
          });

          // Add the promise to the array
          deletionPromises.push(deletionPromise);
        });

        // Use Promise.all to wait for all deletions to complete
        Promise.all(deletionPromises)
          .then((results) => {
            resolve(results);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject('User not connected.');
      }
    });
  });
}



