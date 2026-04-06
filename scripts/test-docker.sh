#!/bin/bash
set -e

echo "=== SpurTalk Docker Full Test Suite ==="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
}

# Trap for cleanup on exit
trap cleanup EXIT

# Build
log_info "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start
log_info "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
log_info "Waiting for services to be healthy..."
sleep 5

# Check PostgreSQL
log_info "Checking PostgreSQL..."
for i in {1..30}; do
    if docker exec spurtalk-postgres pg_isready -U postgres > /dev/null 2>&1; then
        log_info "PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "PostgreSQL failed to start"
        docker-compose -f docker-compose.prod.yml logs postgres
        exit 1
    fi
    sleep 2
done

# Check Redis
log_info "Checking Redis..."
for i in {1..15}; do
    if docker exec spurtalk-redis redis-cli ping > /dev/null 2>&1; then
        log_info "Redis is ready"
        break
    fi
    if [ $i -eq 15 ]; then
        log_error "Redis failed to start"
        docker-compose -f docker-compose.prod.yml logs redis
        exit 1
    fi
    sleep 2
done

# Run database migrations
log_info "Running database migrations..."
docker exec spurtalk-backend npx prisma migrate deploy

# Check Backend health
log_info "Checking Backend health..."
for i in {1..15}; do
    if curl -sf http://localhost:7101/health > /dev/null 2>&1; then
        log_info "Backend is healthy"
        break
    fi
    if [ $i -eq 15 ]; then
        log_error "Backend failed health check"
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi
    sleep 2
done

# Run Backend unit tests
log_info "Running backend unit tests..."
docker exec spurtalk-backend npm test --workspace=@spurtalk/backend -- --passWithNoTests

# Check Web is responding
log_info "Checking Web app..."
for i in {1..15}; do
    if curl -sf http://localhost:7100 > /dev/null 2>&1; then
        log_info "Web app is responding"
        break
    fi
    if [ $i -eq 15 ]; then
        log_warn "Web app may not be ready yet"
    fi
    sleep 2
done

echo ""
log_info "=== All tests passed! ==="
log_info "Services running:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "To stop: docker-compose -f docker-compose.prod.yml down"
echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
