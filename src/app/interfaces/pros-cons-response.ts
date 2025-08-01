export interface ProsConsResponse {
    id:      string;
    type:    string;
    status:  string;
    content: Content[];
    role:    string;
}

export interface Content {
    type:        string;
    annotations: any[];
    logprobs:    any[];
    text:        string;
}
