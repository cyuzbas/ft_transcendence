
export interface UserI {
	id?: number;
	intraId?: string;
	username?: string;
	avatar?: string;
	avatarSmall?: string
	friends?: UserI[]
}
