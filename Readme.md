# [WIP] antbear

[![Build Status](https://travis-ci.org/sapegin/antbear.svg)](https://travis-ci.org/sapegin/antbear) [![npm](https://img.shields.io/npm/v/antbear.svg)](https://www.npmjs.com/package/antbear)

Analyze custom styles usage in the project.

## Motivation

We shouldn’t use custom styles on the application level. We should compose our user interfaces from primitive components. Sometimes, a component library isn’t flexible enough to make it possible, especially when it’s young.

By analyzing custom styles usage in the application and finding which component’s styles developers override the most, we can find what’s missing in the component library: missing component props, missing design tokens, and so on.

## Supports

- [x] JavaScript files
- [x] TypeScript and Flow files
- [x] styled-components and Emotion (`styled` factory)
- [ ] `sx` and `css` props ([Theme UI](https://theme-ui.com/sx-prop))
- [ ] CSS
- [ ] CSS Modules
- [ ] Sass

## Statistics

- [x] Custom styles per module
- [x] Overridden elements
- [x] Overridden components
- [x] CSS properties
- [x] CSS values
- [x] Custom colors (very basic, needs more work)
- [x] Custom spacing
- [x] Components and props
- [x] Components, props and values

## Changelog

The changelog can be found on the [Releases page](https://github.com/sapegin/antbear/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/antbear/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
