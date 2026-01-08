ngrok http 8000

docker exec -it ddp_api_app rm public/storage
docker exec -it ddp_api_app php artisan storage:link

docker compose down
docker compose up -d


git add .
git commit -m "Fix: admin dynamic api and ngrok bypass"
git push origin main