

import { UserRole } from "src/typeorm/roomUser.entity";

export class UserDto {
	id: number;
	userName: string;
	status?: string;
	userRole?: UserRole;
}

export class ValidateUserDto {
	intraId: string;
}