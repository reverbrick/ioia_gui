#!/bin/bash
quasar build
cp -r dist/spa/* ../ioia-mrproj/app/static
mv ../ioia-mrproj/app/static/index.html ../ioia-mrproj/app/templates/gui.html
