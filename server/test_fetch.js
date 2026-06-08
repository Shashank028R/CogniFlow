import https from 'https';

https.get('https://res.cloudinary.com/dojrorkrb/image/upload/v1780904022/test_no_ext.pdf', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
});
