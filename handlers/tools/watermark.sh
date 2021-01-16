#!/bin/bash

WATERMARK=watermark.png

if [[ $# -ne 2 ]] ; then
    echo 'bad arguments (expected watermark.sh input.jpg output.jpg)'
    exit 1
fi

input_image=$1

output_image=$2

echo "Watermarking " $input_image

composite $WATERMARK -gravity southeast $input_image $output_image
