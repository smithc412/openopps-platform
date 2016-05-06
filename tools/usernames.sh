if [ -z $1 ]; then
  echo ""
  echo "usage: make-space.sh <spacename>";
  echo ""
  exit 0;
fi
FILE=$1

csvcut "$FILE" -c Username | sed '/""/d' | sed '/Username/d'

