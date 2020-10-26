#!/bin/bash
quasar build
cp -r dist/spa/* ../app/static
mv ../app/static/index.html ../app/templates/gui.html
