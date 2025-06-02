/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./js/', 'js');
  eleventyConfig.addPassthroughCopy('./assets/', 'assets');

  eleventyConfig.addWatchTarget('./styles/');
  eleventyConfig.addWatchTarget('./js/');
}
