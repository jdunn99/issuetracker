// setErrors(MapError(response.data.errors))
type InputError = {
	field: string;
	message: string;
};

export const MapError = (errors: InputError[]) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		console.log(field);
		errorMap[field] = message;
	});

	return errorMap;
};
