#!/bin/zsh

# clean up the directory
foldersToDelete=$(find . -type d -name "__pycache__")
for folder in ${$(echo $foldersToDelete)[@]}
do
    # echo deleting folder ${folder}
    rm -rf $folder
done