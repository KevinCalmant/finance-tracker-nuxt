const groupBy = <PropertyKey>(array: PropertyKey[], keyGetter: (item: PropertyKey) => string): Record<string, PropertyKey[]> => {
	return array.reduce((result, item) => {
		const key = keyGetter(item);
		if (!result[key]) {
			result[key] = [];
		}
		result[key].push(item);
		return result;
	}, {} as Record<string, PropertyKey[]>);
}

export default groupBy
