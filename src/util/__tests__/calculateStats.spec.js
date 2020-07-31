const { getComponentsStats } = require('../calculateStats');

test('getComponentsStats', () => {
	const result = getComponentsStats([
		{
			component: 'Box',
			styles: [],
		},
		{
			component: 'div',
			styles: [],
		},
		{
			component: 'Box',
			styles: [],
		},
	]);
	expect(result).toMatchInlineSnapshot(`
		Object {
		  "Box": 2,
		  "div": 1,
		}
	`);
});
