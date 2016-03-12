#!/bin/bash

for file in /home/samhv/EBA/wasabi-react/server/public/slides/100/z/*

do
 convert "$file" -resize 720x405 "$file"-resized.jpg
done