
title = "Ford Transit Teardown"

cover = "pristine"

category = "van"

summary = """
So, I bought a van.
It's a 2017 Ford Transit, and now I need to return this van to a pristine, near-factory state; a blank canvas to build upon, if you will.
Here's how I did it.
"""

publishDate = 2020-12-31T18:33:16-06:00

tags = ["van", "ford-transit", "floor"]
+++

So, I bought a van.

It's a 2017 Ford Transit LWB (long wheelbase) medium roof (which equates to a cargo area about 12 feet deep and just under 6 feet tall.)

The first step in any conversion is returning the van to a pristine, near-factory state; a blank canvas, if you will.
(No, when I say 'teardown', I don't mean iFixit-style.
There won't be any repairability scores or subtle shade thrown here.)

# Removing the Cargo Panels

For my van, that means removing the factory interior protective panels.
These are corrugated plastic panels that cover most of the cargo area.
There are four panels on the left side, two panels on the right side, one panel on the sliding door, and one panel each on the two rear doors.

I'm not planning on removing the lower plastic panel on the rear doors.
That panel is a different type than the cargo protection area; it's a nicer plastic, and it's designed to be permanently installed.
It contains the speakers and door opening/locking mechanism, and I don't want to mess with any of that quite yet.

{{$.media(page, 'before-one-panel-removed')}}

The panels are secured with little two-part plastic snap-fit pins.
To remove the pins, you need to first pull out the center with the help of a wedge (I used a screwdriver).
This frees up space for the outer part to contract when pulling it out of the hole in the body.
To remove the outer frame, I found pulling on the thicker area (not where the center-pin-removal-slot is) is worked pretty well.
(I just jammed the screwdriver between the panel and the rim of the outer pin and wrenched at it until it popped out.
I'm lazy like that.)

There are around a dozen of these pins on each panel.
Some commenters online said that with some pins, there's a part that can fall into the body and be lost forever; I didn't find any of these in my panels.

# Cleaning Up the Wiring Loom

There is a wiring loom running along the left top corner of the cargo area, from behind the driver's head all the way to an arch over rear doors.
It's protected by two rather sad-looking, droopy pieces of plastic.
They showed signs of having fallen off in the past, and it looks like the previous owner said "screw it" and screwed the protective cover straight to the frame instead of trusting the factory-installed wiring loom clips.

{{$.media(page, 'wiring-loom-to-front')}}

I found that a lot of the wiring loom clips were either broken or missing, leading to the wire loom sagging an alarming amount in some spots.
The factory clips snap into the frame through two rectangular holes, one above the other.
I decided to make a 3D-printable clip that could snap into the same holes to secure the loom.

(For the curious: the top hole is 17mm wide, the bottom hole is 9mm wide, and both holes are 9mm tall.
There's an inside radius of around 1mm, and the metal between the holes is 17mm edge-to-edge.)

{{$.media(page, 'wiring-loom-clip-detail')}}

So I designed a 3D-printed clip to replace the missing factory clips.
It snaps tightly into the factory holes in the frame, and has an internal slot to hold a 4mm ziptie.
I printed a couple of these, iterating along the way, and it's [available for download on Prusa Printers]() in case there are others with the same issue.

After removing the cargo protection panels on the left side, I realized that the left side bodywork had been replaced.
It was pretty obvious: there were unfinished welds (some complete with welding wire stuck in place!) and a poorly-applied sealant between the body and the frame members.
Also, the replacement bodywork panels were black on the inside, not white.
(I expect the outside was color-matched and professionally painted.)

I knew before the purchase that the vehicle had been in a "minor" accident in the rear left, but I didn't think replacing the entire left side of the exterior bodywork would be classified as "minor."
Even if I knew where to look for the signs of a replaced body panel, it wouldn't have been possible at the dealer, as all the signs were covered by interior paneling.

# Removing the Floor Mat

There's a giant rubber floor mat covering the entire cargo area.
It had something slightly soft underneath (which turned out to be recycled denim insulation.)
The floor mat is fitted underneath the plastic sliding door trim panel and the plastic rear door trim panel.
The floor mat only extends about half an inch under the rear door trim panel, so I could just pull it out with little effort.
But the plastic sliding door trim panel was clamped down tightly on the floor mat.
I'm planning on rebuilding the sliding door area anyway, so the trim panel could go.

It's held down in three ways: along the top edge of the trim panel, level with the cargo area floor, there are two plastic christmas tree retainers.
These can be pulled out carefully with a screwdriver and your fingers: just wiggle it in a circular motion to lift it up, one level at a time.
The trim panel is also held in place with a handful of screws in the step.
These are concealed with a circular plastic cover, which unfortunately are tightly fitted to the trim panel.
I had to mash a screwdriver in there, deforming the cover, to pry it up.
(As I'm not planning on reusing any of these panels, I wasn't worried about cosmetic damage.)
Finally, remove the Torx screws.

And finally, there are some retaining clips holding the trim panel in place.
Firmly lift it up starting from the left or right side, and pull hard to release these clips.

Once the sliding door trim panel was removed, the mat could be folded in half lengthwise (to clear the wheel wells and C-pillar columns) and pulled out.
It's 12 feet long and quite heavy, so it was a challenge for me to do it solo.
Like I mentioned, the denim insulation was damp, so I laid it out on the ground upside-down overnight to dry.

The dealer had washed the van with impunity, so the denim was wet, making the floor mat quite heavy and difficult to maneuver.

# Cleaning the Floor

{{$.media(page, 'van-cleaning')}}

Now that the bare metal is fully exposed, it's time to clean up the van.
There are layers of grime and metal filings under the floor.
First, I used a hand brush and a vacuum to clean out the big pieces of debris.
Next, I used a wet paper towel (a *lot* of wet paper towels) to pick up the majority of the fine debris.
This was important, because a lot of the fine debris was metal filings produced from holes drilled through the body, and I didn't want to accidentally grind these filings into the floor and scratch the paint.

Once the floor was free of debris, I wet the areas with surface rust and scrubbed it off with a scouring pad, then let it air-dry.
This left many small areas of bare metal which will need to be covered up to prevent further rusting.

# Painting Exposed Metal

Now, I need to cover all of the exposed bare metal on the floor.
I used a quart of Rustoleum gloss-white paint for this, along with sponge brushes (which I incorrectly thought would provide a better finish than bristled brushes.)
I'm not worried about color-matching, because all of the metal inside will be completely covered up with the interior of the van.
I wiped the floor clean and let it air-dry, then wiped it down with isopropyl alcohol to get rid of oil and grease.
Along the way, I also painted some spots on the walls that had been scraped clear of paint.
