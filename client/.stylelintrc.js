module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Enforce rem units instead of px for certain properties
    'declaration-property-unit-allowed-list': {
      'font-size': ['rem', 'em', '%'],
      'line-height': ['rem', 'em', ''],
      'margin': ['rem', 'em', '%', 'auto'],
      'margin-top': ['rem', 'em', '%', 'auto'],
      'margin-right': ['rem', 'em', '%', 'auto'],
      'margin-bottom': ['rem', 'em', '%', 'auto'],
      'margin-left': ['rem', 'em', '%', 'auto'],
      'padding': ['rem', 'em', '%'],
      'padding-top': ['rem', 'em', '%'],
      'padding-right': ['rem', 'em', '%'],
      'padding-bottom': ['rem', 'em', '%'],
      'padding-left': ['rem', 'em', '%'],
      'gap': ['rem', 'em', '%'],
      'row-gap': ['rem', 'em', '%'],
      'column-gap': ['rem', 'em', '%']
    },
    
    // Forbid duplicate font imports
    'no-duplicate-at-import-rules': true,
    'font-family-no-duplicate-names': true,
    
    // Additional rules to enforce consistent rem usage
    'length-zero-no-unit': true,
    'unit-no-unknown': true,
    
    // Warn about px usage in certain contexts
    'declaration-property-unit-disallowed-list': {
      'font-size': ['px'],
      '/^margin/': ['px'],
      '/^padding/': ['px']
    }
  }
};
