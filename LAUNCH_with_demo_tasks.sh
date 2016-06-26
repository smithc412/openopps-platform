#!/bin/sh

# Kill any currently-running instance of the server
killall node
# ... then launch new instance of the server with fresh DB
sh tools/postgres/cleandb.sh
npm run demo
