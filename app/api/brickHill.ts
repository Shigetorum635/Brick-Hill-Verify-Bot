import * as phin from 'phin';

const USERNAME_API: string = 'https://api.brick-hill.com/v1/user/id?username=';
const PROFILE_API: string = 'https://api.brick-hill/v1/user/profile?id=';
// TODO; add types support.
const getIdFromUsername = async (username: string): Promise<boolean[]> => {
	{
		try {
			const data = (
				await phin.default({
					url: USERNAME_API + username
				})
			).body;
			// @ts-expect-error
			return [data.id, data.error];
		} catch (error) {
			return [false, false];
		}
	}
};

const getUserData = async (userId: number) => {
	const data = (await phin.default({ url: PROFILE_API + userId })).body;
	return data;
};

export default { getUserData, getIdFromUsername };
