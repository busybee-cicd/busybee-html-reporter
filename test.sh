#!/bin/bash

mv tsconfig.json tsconfig.build.json
mv tsconfig.test.json tsconfig.json
node_modules/.bin/ava-ts test/*.ts
mv tsconfig.json tsconfig.test.json
mv tsconfig.build.json tsconfig.json