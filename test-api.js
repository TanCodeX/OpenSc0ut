const urls = [
  'https://summerofcode.withgoogle.com/api/archive/program/2021/organizations/',
  'https://summerofcode.withgoogle.com/api/archive/programs/2021/organizations/',
  'https://summerofcode.withgoogle.com/api/archive/program/2021/organizations',
  'https://summerofcode.withgoogle.com/api/programs/2021/organizations/'
];

async function check() {
  for (const url of urls) {
    const res = await fetch(url);
    console.log(url, res.status);
  }
}
check();
