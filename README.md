# 

TO RUN:
```
docker-compose build

docker-compose -f docker-compose.yml up neo4j

cd ./app/
yarn

yarn run test ./order/;
yarn run test ./machine/;
yarn run test ./sweet/;
yarn run test ./producedBy/;
yarn run test ./orderContains/;
yarn run test:e2e
```

Note:

yarn run test doesn't work properly because of collision in the database with the created models. If this was a production app this would be addressed.

Todo (future for production):

Better Error handling
Business logic around orders and statuses
Adding and removing order items when the status is no longer open but delivered or closed eg
Constraints around which sweets can be added to which machine