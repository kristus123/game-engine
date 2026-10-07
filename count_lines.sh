#!/bin/bash

# For motivation / ego boost

find . -type f \( \
	-name "*.js" \
	-o -name "*.ts" \
	-o -name "*.html" \
	-o -name "*.css" \
\) \
	-not -path "./node_modules/*" \
	-not -path "./dist/*" \
	-not -path "./transpiledBackend/*" \
	-not -path "./.git/*" \
	-print0 | xargs -0 cat | wc -l
