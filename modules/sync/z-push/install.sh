#!/bin/bash

VERSION="2.2.8";
URL="http://download.z-push.org/final/";

FOLDER=`echo $VERSION | cut -c 1-3`;

cd `dirname "$0"`

rm -f z-push-$VERSION.tar.gz
rm -Rf ../../z-push*

wget ${URL}/${FOLDER}/z-push-$VERSION.tar.gz

tar zxf z-push-$VERSION.tar.gz
mv z-push-$VERSION ../../z-push

cp -R backend/go ../../z-push/backend
cp config.php ../../z-push

rm -f z-push-$VERSION.tar.gz
echo "z-push_${VERSION} installed!"
