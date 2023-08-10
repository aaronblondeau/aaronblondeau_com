module.exports = function (eleventyConfig) {    
    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy({'public/robots.txt': '/robots.txt'});
};