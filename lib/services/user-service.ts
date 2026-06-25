import { MaithilResponse } from "@/types/common";
import { UserProfileRequest, UserProfileResponse } from "@/types/user";
import apiClient from "../api-client";

const userUrl = "/user/api";

export const userService = {
  getUserProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<MaithilResponse<UserProfileResponse>>(`${userUrl}/profile`,);
    return response.data.data;
  },

  updateUserProfile: async (userData: UserProfileRequest,):Promise<UserProfileResponse> => {
    const response = await apiClient.put<MaithilResponse<UserProfileResponse>>(`${userUrl}/profile`,userData);
        return response.data.data;;
  },
};
