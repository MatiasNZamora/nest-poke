
// esto valida nuestras variables de entorno.

export const EnvCOnfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 4001,
    defaultLimit: +process.env.DEFAULT_LIMIT || 7,
});