const { parseJavaScript } = require('../parseJavascript');

test('HTML element, object notation', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const BoldParagraph = styled.p({
	margin: 0,
	fontWeight: 'bold',
})
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "p",
		    "styles": Array [
		      Object {
		        "name": "margin",
		        "value": 0,
		      },
		      Object {
		        "name": "font-weight",
		        "value": "bold",
		      },
		    ],
		  },
		]
	`);
});

test('custom component, object notation', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const BoldParagraph = styled(Text)({
	fontWeight: 'bold'
})
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "Text",
		    "styles": Array [
		      Object {
		        "name": "font-weight",
		        "value": "bold",
		      },
		    ],
		  },
		]
	`);
});

test('HTML element, object notation, value from theme', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const PrimaryHeading = styled.h1({
	color: props => props.theme.colors.primary
})
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "h1",
		    "styles": Array [
		      Object {
		        "name": "color",
		        "value": "theme.colors.primary",
		      },
		    ],
		  },
		]
	`);
});

test('HTML element, object notation as function', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const PrimaryHeading = styled.h1(props => ({
	color: props.theme.colors.primary
}))
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "h1",
		    "styles": Array [
		      Object {
		        "name": "color",
		        "value": "theme.colors.primary",
		      },
		    ],
		  },
		]
	`);
});

test('HTML element, template literal', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const BoldParagraph = styled.p\`
	font-weight: bold;
	color: salmon;
\`
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "p",
		    "styles": Array [
		      Object {
		        "name": "font-weight",
		        "value": "bold",
		      },
		      Object {
		        "name": "color",
		        "value": "salmon",
		      },
		    ],
		  },
		]
	`);
});

test('custom component, template literal', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const BoldParagraph = styled(Text)\`
	font-weight: bold;
\`
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "Text",
		    "styles": Array [
		      Object {
		        "name": "font-weight",
		        "value": "bold",
		      },
		    ],
		  },
		]
	`);
});

test('HTML element, template literal, value from theme', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const PrimaryHeading = styled.h1\`
	color: \${props => props.theme.colors.primary};
\`
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "h1",
		    "styles": Array [
		      Object {
		        "name": "color",
		        "value": "theme.colors.primary",
		      },
		    ],
		  },
		]
	`);
});

test('HTML element, template literal, TypeScript', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const BoldParagraph: any = styled.p\`
	font-weight: bold;
	color: salmon;
\`
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "p",
		    "styles": Array [
		      Object {
		        "name": "font-weight",
		        "value": "bold",
		      },
		      Object {
		        "name": "color",
		        "value": "salmon",
		      },
		    ],
		  },
		]
	`);
});

test('HTML element, template literal, JSX', () => {
	const result = parseJavaScript(
		`
import styled from 'styled-components';
const Foo = () => <h1>Henlo</h1>;
const BoldParagraph = styled.p\`
	font-weight: bold;
	color: salmon;
\`
	`,
		'test.js'
	);
	expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "component": "p",
		    "styles": Array [
		      Object {
		        "name": "font-weight",
		        "value": "bold",
		      },
		      Object {
		        "name": "color",
		        "value": "salmon",
		      },
		    ],
		  },
		]
	`);
});
