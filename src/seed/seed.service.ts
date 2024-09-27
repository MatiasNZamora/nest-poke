import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor( 
    @InjectModel( Pokemon.name ) 
    private readonly PokemonModel: Model<Pokemon>,
    private readonly http:AxiosAdapter,
  ){}
  

  async executeSeed(){
    // eleimino la coleccion de pokemon actual en base de datos
    await this.PokemonModel.deleteMany({}); // esto es igual al delete * from pokemon.

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    const pokemonToInsert: {name:string, no:number}[] = [];

    data.results.forEach(( {name, url} ) => {
      
      // separo de la data la informacion name y numero
      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ];

      // genero la consulta y lo envio a la base de datos 
      // await this.PokemonModel.create( {name, no} );

      pokemonToInsert.push( {name , no} );
    });
    
    await this.PokemonModel.insertMany(pokemonToInsert);

    return 'seed Executed';
  };

};
