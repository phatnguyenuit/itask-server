// This uses to get/fetch token before requesting private routes
console.log('Folder pre-request');

function getToken() {
  const host = pm.environment.get('host');
  const email = pm.environment.get('email');
  const password = pm.environment.get('password');

  const url = `${host}/api/v1/auth/login`;
  const postRequest = {
    url,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify({ email, password }),
    },
  };

  pm.sendRequest(postRequest, (error, response) => {
    if (error) {
      console.error(error);
    } else {
      const { data } = response.json();
      console.log(`data`, data);
      console.log('Get token successfully', data);

      const now = new Date().getTime();
      const newExpiredAt = now + data.expiredAt * 1000;

      pm.environment.set('expiredAt', newExpiredAt);
      pm.environment.set('accessToken', data.accessToken);
    }
  });
}

function fetchOrReuseToken() {
  const accessToken = pm.environment.get('accessToken');
  const expiredAt = pm.environment.get('expiredAt') || 0;

  const currentTime = new Date().getTime();
  const isValidToken = accessToken && currentTime < expiredAt;

  if (isValidToken) {
    console.log('Access token is valid, no need to get new one.');
  } else {
    console.warn('Access token is invalid, getting new one...');
    getToken();
  }
}

fetchOrReuseToken();

pm.request.headers.add({
  key: 'x-access-token',
  value: '{{accessToken}}',
});
