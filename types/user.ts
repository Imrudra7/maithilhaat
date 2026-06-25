export interface UserProfileRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    addresses: string[];
}

export interface UserProfileResponse {
    stats: any;
    bio: string;
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    addresses: string[];
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
    notification: Record<string, string>;
}
