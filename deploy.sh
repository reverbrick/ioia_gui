#!/bin/bash
quasar build
scp -r dist/spa/* reverbrick@ioia.io:/home/reverbrick/rcp_ioia/
