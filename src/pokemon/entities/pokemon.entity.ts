//TODO: la entidad es una referencia directa de como quiero grabar en mi base de datos. En mongo que es noSQL se las conoce como colecciones y documentos.
//TODO: Quiero crearme una coleccion("TABLA") en la cual voy a insertar documentos("REGISTRO DE UNA TABLA");

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    // id: string; mongo me lo da
    
    @Prop({
        unique:true,
        index: true, //nos sirve para saber espesificamente donde esta el elemento.
    })
    name: string;

    @Prop({
        unique:true,
        index: true,
    })
    no: number;

};

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);