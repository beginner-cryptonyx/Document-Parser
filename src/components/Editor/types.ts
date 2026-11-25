export type Box = {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export type Block = Box & {
    id: string;
    text: string;
    original: string;
    deleted: boolean;
}

