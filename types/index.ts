export interface JWT {
    id: string;
    user_id: string;
    email: string;
    org_id: string;
    page_id: string;
    name: string;
    iat: number;
    exp: number;
    blockedUsers: string[];
    plan_name: string;
    role: string;
}

export interface APIResponse {
    data?: any,
    error?: any,
    success: string
}

export interface FailedAPIResponse {
    success: boolean;
    data: string;
  }

  export interface FailedFirebaseResponse {
    code: string;
  }
  
  export interface ChildInputRef {
    validate: () => void;
  }