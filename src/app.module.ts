import { join } from 'path'; //node
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvCOnfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    
    ConfigModule.forRoot({ // validamos las variables de entorno con la configuracion del envConfiguration
      load: [ EnvCOnfiguration ],
      validationSchema: JoiValidationSchema, // Le digo que utilize el esquema de validacion de join.
    }),

    ServeStaticModule.forRoot({ // ruta de nuestra pagina estatica
      rootPath: join(__dirname,'..','public'),
    }),
    
    MongooseModule.forRoot( process.env.MONGODB, {
      dbName: 'PokemonDB-Nest'
    } ), // conexion a base de datos
    
    PokemonModule, CommonModule, SeedModule // modulo de pokemon
  ],
  controllers: [],
  providers: [],
})

export class AppModule {};