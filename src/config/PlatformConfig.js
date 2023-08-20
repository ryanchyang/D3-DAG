let platformConfig = {}

const beforeOnlineConfig = { // 測試環境
    title: 'Whospay 測試',
    baseURL: 'https://whospay.com/',
    appId: 'dev-id',
    imageDomain: 'https://image.whospay.com'
}

const whospayConfig = { // 正式環境
    title: 'Whospay',
    baseURL: 'https://whospay.com/',
    appId: 'dev-id',
    imageDomain: 'https://image.whospay.com'
}

switch(process.env.APP_ENV) {
    case('beforeOnline'):
        platformConfig = beforeOnlineConfig
        break
    case('whospay'):
        platformConfig = whospayConfig
        break
    default:
        platformConfig = beforeOnlineConfig
}

export default platformConfig