module.exports = {
  plugins: {
    autoprefixer: {
      // Automatically add vendor prefixes for the last 2 versions of browsers
      // This ensures Safari & Edge get proper flex/grid prefixes
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'Safari >= 10',
        'Edge >= 14'
      ],
      // Enable grid prefixes for IE/Edge
      grid: true,
      // Enable flexbox prefixes
      flexbox: 'no-2009'
    }
  }
};
