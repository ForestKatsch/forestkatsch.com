
title = "Salsa Blueprint Font"
summary = "I created a font based on my handwriting. Here's how I did it."

category = "creative"

tags = ["font", "design"]
publishDate = 2020-12-31T10:23:00-06:00

cover = './salsa-blueprint-showcase'
+++

This website is typset with **Salsa Blueprint**, a font based on my handwriting.
This is my first serious attempt at creating a font, and I've learned a *ton* about font design.

# The Design

Most handwriting fonts aren't really suitable for long-form text.
My intent with this font was to create a very readable font, even at typical body text sizes.
To that end, the strokes are thicker than normal, and the letter spacing is a touch wider than most handwriting fonts I've seen.
I've also tried to keep letterforms unique where possible; for example, the letters I, i, l, and 1 are all clearly distinct from each other.

At the same time, I've tried hard to stay true to my actual handwriting
I've explicitly left in some quirks of my handwriting in an effort to avoid making this font a "digital" handwritten font.

# The Process

First, I used [Calligraphr](https://www.calligraphr.com) and [Procreate](https://procreate.art) to build the foundation of the font.
I hand-drew the alphabet, numbers, and punctuation (along with some special characters like α and ƒ); then, I exported this font from Calligraphr as a TTF.

From there, I imported the font into [Birdfont](https://birdfont.org/).
I manually cleaned up most of the glyphs, then tweaked spacing and kerning for hundreds of characters.
I also manually drew all the ligature glyphs (they weren't imported from Calligraphr's exported font).
After hours of tweaking the kerning to make text flow nicely, I exported to TTF and WOFF2 to reduce the download size of the font.
(The WOFF2 font, which should be supported on all modern browsers, is <20kb! That's less than 15% the size of React!)

The font is a work-in-progress, and I'll probably revisit it over time to fix up kerning or add new glyphs.

# Ligatures

Several ligatures are implemented, including fi, ffi, fl, ffl, ff, and tt.
These can be more difficult to design than first meets the eye, but they're pretty much a necessity in any serious font.

# Todo

There are many things I could improve in my font:

* More typographic ligatures (notably 'Fi' and 'Fl', but 'll', 'rr', 'ss' and others are also good candidates for new ligatures.)
* Alternate glyphs.
  Right now, every character only has a single glyph.
  Adding more alternate glyphs will make text appear more natural.
* More characters.
  I'm missing most mathematical characters, as well as anything other than English letters and numbers.
* Better kerning.
  I've only done a casual kerning pass on the more common combinations, so you might ocassionally see some poor kerning.

# License

Salsa Blueprint is made available under the [SIL Open Font License](https://en.wikipedia.org/wiki/SIL_Open_Font_License).

