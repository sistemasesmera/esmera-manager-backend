export interface JwtPayload {
  email: string;
  role: string;
  id: string;
  branch: {
    id: string;
    name: string;
    address: string;
  };
}
