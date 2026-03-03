#

targetdir=/mnt/c/Users/pablo/Documents/qsf/src

find src -type f | while read filepath; do
  filename=$(basename "$filepath")
  newname="${filename}.txt"
  #newname=${filename}
  cp "$filepath" "$targetdir/$newname"
done

