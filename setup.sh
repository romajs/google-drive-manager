#!/bin/bash -e

DIR=$(dirname $0)

if [[ -z $(command -v nodejs) ]]; then
	curl -sL https://deb.nodesource.com/setup | sudo bash - && sudo apt-get install -y nodejs
fi

declare -a MODULES=("googleapis" "google-auth-library" "jquery-deferred" "path")

for MODULE in "${MODULES[@]}"
do
	if [[ ! -d $DIR/node_modules/$MODULE ]]; then
		echo "Node module \"$MODULE\" is not installed"
		sudo npm install $MODULE --save
	fi
done

echo "nodejs: $(nodejs -v), npm: $(npm --version)" 
exit 0;r