let axios = require('axios')


axios.get('https://course-1252290422.cos.ap-shanghai.myqcloud.com/%E5%90%B4%E5%86%9B%C2%B7%E7%A1%85%E8%B0%B7%E6%9D%A5%E4%BF%A1/files.json').then(res => {
  console.log(res);
})
