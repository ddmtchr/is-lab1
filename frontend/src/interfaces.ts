export interface RowData {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: Date;
    studentsCount: number;
    expelledStudents: number;
    transferredStudents: number;
    formOfEducation: FormOfEducation;
    shouldBeExpelled: number;
    semesterEnum: Semester;
    groupAdmin: Person;
}

export enum FormOfEducation {
    DISTANCE_EDUCATION,
    FULL_TIME_EDUCATION,
    EVENING_CLASSES
}

export enum Semester {
    SECOND,
    THIRD,
    FOURTH,
    SIXTH,
    EIGHTH
}
export enum Color {
    YELLOW,
    ORANGE,
    WHITE
}

export enum Country {
    RUSSIA,
    UNITED_KINGDOM,
    CHINA,
    INDIA
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface Location {
    x: number;
    y: number;
    z: number;
    name: string;
}

export interface Person {
    name: string;
    eyeColor: Color;
    hairColor: Color;
    location: Location;
    weight: number;
    nationality: Country;
}
