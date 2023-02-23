#!/bin/bash

if [ -z $1 ]; then
	echo "error: Please input a name for the docker image."; exit 1
fi

echo "" > .env
NUMREGEX='^[0-9]+$'

read -p "CAS_LOGIN: " CAS_LOGIN
if [ -z ${CAS_LOGIN} ]; then
	echo "error: please input a CAS username to log in to ADE with." >&2; exit 1
fi
read -s -p "CAS_PASSWORD: " CAS_PASSWORD
if [ -z ${CAS_PASSWORD} ]; then
	echo "error: please input a CAS password to log in to ADE with." >&2; exit 1
fi
echo ""
read -p "CLEAN_FETCH_TIMER: " CLEAN_FETCH_TIMER
if [ -z ${CLEAN_FETCH_TIMER} ]; then
	CLEAN_FETCH_TIMER=600000
fi
if ! [[ $CLEAN_FETCH_TIMER =~ $NUMREGEX ]] ; then
   echo "error: CLEAN_FETCH_TIMER is not a number" >&2; exit 1
fi
read -p "CLEAN_USERS_TIMER: " CLEAN_USERS_TIMER
if [ -z ${CLEAN_USERS_TIMER} ]; then
	CLEAN_USERS_TIMER=600000
fi
if ! [[ $CLEAN_USERS_TIMER =~ $NUMREGEX ]] ; then
   echo "error: CLEAN_USERS_TIMER is not a number" >&2; exit 1
fi
read -p "CAS_SERVER: " CAS_SERVER
if [ -z ${CAS_SERVER} ]; then
	echo "error: please input a CAS server. For example, https://cas.bordeaux-inp.fr"
fi
read -p "CAS_PROXY: " CAS_PROXY

cat << EOF > .env
CAS_LOGIN="${CAS_LOGIN}"
CAS_PASSWORD="${CAS_PASSWORD}"
CLEAN_FETCH_TIMER=${CLEAN_FETCH_TIMER}
CLEAN_USERS_TIMER=${CLEAN_USERS_TIMER}
CAS_SERVER="${CAS_SERVER}"
CAS_PROXY="${CAS_PROXY}"
SESSION_SECRET_KEY="$(cat /dev/urandom | tr -cd '[:graph:]' | head -c 32)"
EOF

docker build -t="$1" .
rm .env