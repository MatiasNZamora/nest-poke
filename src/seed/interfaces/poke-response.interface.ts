// fue creado con el Paste as json (extencion)

export interface PokeResponse {
    count:    number;
    next:     string;
    previous: null;
    results:  Result[];
};

export interface Result {
    name: string;
    url:  string;
};
