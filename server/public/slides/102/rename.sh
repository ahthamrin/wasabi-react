#!/bin/bash

for file in zz/*
do
	replace=-thumb
	result_string="${file/.jpg-resized.jpg-resized-t/$replace}"
	replace=zz/ws
	result_string="${result_string/zz'/'/$replace}"
	mv $file $result_string
done
