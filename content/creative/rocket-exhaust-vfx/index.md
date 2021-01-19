
title = "Rocket Exhaust VFX breakdown"
summary = "How to use Blender Cycles volumetrics to make realistic-looking rocket exhaust."

category = "creative"

tags = [
  "creative",
  "vfx",
  "blender",
  "blender-cycles",
  "featured"
]

cover = 'sea-level'

publishDate = 2021-01-14T00:00:00Z

+++

I used Blender (and the Cycles render engine) to make rocket exhaust VFX.

In the past, I've experimented with mesh-based exhaust, but that's not a good fit for (pseudo)-photorealistic renders, and it's hard to make it look good from all angles.
For this shader, I wanted a single material that could blend seamlessly through all throttle levels and all altitudes.

Here's what I ended up on for the renders you see here:

* Convert cartesian coordinates to polar coordinates
* Split into two parts: outer shell, and mach diamonds
* For the outer shell, apply a cosine to the distance of the polar coordinate to simulate expansion and contraction
* For the mach diamonds, multiply the radius by the distance, modulo the period (to linearly increase the scale from 0 to the default of 1)
* Color the resulting "strength" field with color ramps that change with location and length along the exhaust
* Add these together, and clip to the inside of the engine nozzle using a parabola shape (to avoid exhaust from appearing outside the nozzle, which is bad)

There are many other minor effects, such as a strong brightness boost near the nozzle, and a group of nodes that simulate severe underexpansion (simulating an engine burning in a vacuum.)
But those are all just simple distortion node groups, applied to the polar coordinates.

{{$.media(page, 'sea-level')}}

# The Method

Since most rocket engines are circular, I decided to use polar coordinates to represent the exhaust.
Using Blender's *Texture Coordinate* node, I use the *Object* coordinate to get the coordinate of the 3D point currently under evaluation.
Then, I convert this to polar coordinates with a bit of math: *X* corresponds to distance from center, *Y* corresponds to angle (not currently used), and *Z* corresponds to distance along the engine exhaust, with positive numbers being above the nozzle exit plane, and negative numbers being below the nozzle exit plane.

[Apogee SSG]({{page.link('/software/apogee')}})

