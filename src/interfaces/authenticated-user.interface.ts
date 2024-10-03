import { UserRoles } from 'src/constants/Roles.enum';

// authenticated-user.interface.ts
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRoles;
}
