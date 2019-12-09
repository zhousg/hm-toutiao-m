// vue-cli的配置文件
module.exports = {
  // 配置
  css: {
    loaderOptions: {
      less: {
        // less-loader的配置
        modifyVars: {
          // key 变量名  value 修改的值
          'blue': '#3296fa'
        }
      }
    }
  },
  publicPath: './'
}
