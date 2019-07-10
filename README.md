# Map of the Recurse Center

This map was made by SP2'19 folks in April 2019 during the *Silly or Useful Things Hackathon* (S.O.U.T.H.) at RC!

## The base map

The base SVG lives at [blinry/map-of-rc](https://github.com/blinry/map-of-rc). A good, open-source and cross-platform program to edit is is [Inkscape](https://inkscape.org) – feel free to create pull requests for additions or changes, or open issues regarding the content of the map in that repository!

That repository also contains a script called `make-tiles.rb`, which renders the SVG into JPG tiles suitable for display on the web using the [Leaflet](https://leafletjs.com) library.

## The tile repository

We're using [blinry/map-of-rc-tiles](https://github.com/blinry/map-of-rc-tiles) to host the generated tiles. The online map will fetch tiles from it's GitHub pages deployment at [blinry.github.io/map-of-rc-tiles/](https://blinry.github.io/map-of-rc-tiles/1/0/0.jpg). The conversion to tiles currently happens manually, and we just force-override that repository with the latest tiles.

## The web interface

This repository is a fork of Michael Kreil's [30C3 map](https://github.com/MichaelKreil/30c3-map), with updated dependencies. It fetches the tiles from the above repository, allows interactivity, and has a builtin location sharing feature, accessible via the button in the top right corner.

To keep the resulting links stable, when introducing breaking changes to the map, move the result to another subfolder, like *v1* and *v2*. The first version is at *v0*.
