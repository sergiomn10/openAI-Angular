

export interface Message {
    text: string;
    idGpt: boolean;
    info?: {
        userScore: number;
        errors: string[];
        message: string;
    }
    
}