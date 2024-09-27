import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  //metodo privado para simplificar las exepciones
  private handleExceptions( error:any ){
    if( error.code === 11000){
      throw new BadRequestException( `Pokemon exist in DB ${ JSON.stringify(error.keyValue) } ` );
    };
    console.log(error);
    throw new InternalServerErrorException(` Cant create/update Pokemon - Check server logs `);
  };

  private defaultLimit:number;

  constructor( 
    @InjectModel( Pokemon.name ) 
    private readonly PokemonModel: Model<Pokemon>, 
    private readonly configService:ConfigService,
  ){
    this.defaultLimit = configService.get<number>('defaultLimit');
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.PokemonModel.create( createPokemonDto );
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    };
  };

  async findAll( paginationDto:PaginationDto ) {
    const { limit = 5, offset = 0 } = paginationDto;
    return this.PokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({ no:1 })
      .select('-__v');
  };

  async findOne( term: string ) {
    let pokemon:Pokemon;
      

    // verificacion por numero
    if(!isNaN(+term)){
      pokemon = await this.PokemonModel.findOne( { no: term } ) // busca y compara el campo "no" y cuando lo encuertra lo asigna a la variable pokemon y lo retorna.
    };

    // verificacion por mongo ID
    if( !pokemon && isValidObjectId(term) ){ // si existe el pokemon lo salta y no lo evalua
      pokemon = await this.PokemonModel.findById(term);
    }

    // verificacion por Name
    if( !pokemon ){
      pokemon = await this.PokemonModel.findOne( { name: term.toLocaleLowerCase( ).trim() } ); // busca un objeto que en su campo name contenga lo que viene en term pasado a minuscula y sin espacios a delante y atras.
    }



    // si no se encontro ningun pokemon
    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or ${term} not found.`)


    return pokemon;
  };

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {

      await pokemon.updateOne( updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto }; //esparso las propiedades del pokemon y luego sobreescribo con lo que me llega del body.

    } catch (error) {

      this.handleExceptions(error);

    };
  };

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne()
    // const result = await this.PokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.PokemonModel.deleteOne( { _id:id } );
    if( deletedCount === 0 ) throw new BadRequestException(`Pokemon with id ${id} not found`);
    return;
  };

  async seed(){
    return 'seed executed';
  };

};