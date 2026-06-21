export interface MaithilResponse<T> {
    success: boolean;
    code: string;
    message: string;
    data: T;
    notification?: Record<string, string> | null;
    timestamp: string;
}