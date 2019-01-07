let fg = require('fast-glob')
let fs = require('fs')
const REPLACE_PATH = '/Users/linwu/Documents/书籍'

let getDirectoryFiles = (path) => {
  // 读取目录信息
  fg(`${path}/**`).then(entries => {
    entries = entries.map(item => {
      item = item.replace(REPLACE_PATH, '')
      return item
    })

    // 写入文件
    fs.open(`${__dirname}/file.json`, 'w+', (err, fd) => {
      if (err) throw err
      fs.writeFile(`${__dirname}/files.json`, JSON.stringify(entries), { encoding: 'utf8', flags: 'w+' })
      fs.close(fd)
    })
  })
}

getDirectoryFiles('/Users/linwu/Documents/书籍/吴军·硅谷来信')
