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
    createdBy: number;
    adminCanEdit: boolean
}

export enum FormOfEducation {
    DISTANCE_EDUCATION = 'DISTANCE_EDUCATION',
    FULL_TIME_EDUCATION = 'FULL_TIME_EDUCATION',
    EVENING_CLASSES = 'EVENING_CLASSES',
}

export enum Semester {
    SECOND = 'SECOND',
    THIRD = 'THIRD',
    FOURTH = 'FOURTH',
    SIXTH = 'SIXTH',
    EIGHTH = 'EIGHTH'
}
export enum Color {
    YELLOW = "YELLOW",
    ORANGE = "ORANGE",
    WHITE = "WHITE"
}

export enum Country {
    RUSSIA = "RUSSIA",
    UNITED_KINGDOM = "UNITED_KINGDOM",
    CHINA = "CHINA",
    INDIA = "INDIA"
}

export interface Coordinates {
    id: number;
    x: number;
    y: number;
}

export interface Location {
    id: number;
    x: number;
    y: number;
    z: number;
    name: string;
}

export interface Person {
    id: number;
    name: string;
    eyeColor: Color;
    hairColor: Color;
    location: Location;
    weight: number;
    nationality: Country;
}


export enum AccessRights {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface RegisterData {
    username: string;
    password: string;
    roles: AccessRights[]
}

export interface importHistoryData {
    id: number,
    status: string
    userId: number,
    objectsCount: number,
    fileName: string
}