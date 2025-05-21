export enum PassengerType {
    ADULTS = 'adults',
    CHILDREN = 'children',
    INFANTS = 'infants',
}

export interface Airport {
    name: string;
    code: string;
    city: string;
}