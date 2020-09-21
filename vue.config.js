const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            // CHANGE NODE MODULES PATH TO WHERE ELECTRON IS INSTALLED. FOR MONOREPOS IT'S USUALLY ../../node_modules
            from: './node_modules/push-receiver/src/gcm/checkin.proto',
            to: './dist_electron/checkin',
            toType: 'file'
          },
          {
            // CHANGE NODE MODULES PATH TO WHERE ELECTRON IS INSTALLED. FOR MONOREPOS IT'S USUALLY ../../node_modules
            from: './node_modules/push-receiver/src/mcs.proto',
            to: './dist_electron/mcs',
            toType: 'file'
          }
        ]
      })
    ]
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    // config.plugin('CopyWebpackPlugin').use(CopyWebpackPlugin, [
    //   {
    //     patterns: [
    //       {
    //         from: 'node_modules/push-receiver/src/gcm/checkin.proto',
    //         to: 'dist_electron/'
    //       }
    //     ]
    //   }
    // ])
  }
}
