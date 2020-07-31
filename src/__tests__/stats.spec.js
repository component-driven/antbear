const { getElementsStats, getComponentsStats } = require('../stats');

test('getElementsStats', () => {
	const result = getElementsStats([
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
		  "div": 1,
		}
	`);
});

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
		}
	`);
});
