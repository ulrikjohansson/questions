docker network create --subnet=192.168.2.0/24 questions
docker run --net=questions -v "$(pwd)":/data --name mongo -d mongo mongod --smallfiles
docker build -t questions .
docker run --net=questions --name=bq -it -p 8000:3000 questions
