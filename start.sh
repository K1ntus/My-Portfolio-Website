# $env:BUILDKIT_PROGRESS="plain" (display output of commands)
cd webapp && docker compose build web
# docker-compose -f .\deployment\docker-compose.yml up --build

# docker-compose up --no-deps -d web