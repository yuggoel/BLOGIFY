FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy full project into the image
COPY . .

# Default PORT fallback
ENV PORT=8000

EXPOSE 8000

# Copy start script and make executable
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Use a shell entrypoint so platform-provided commands are executed with shell
# (this allows $PORT to be expanded if the platform overrides the command)
ENTRYPOINT ["sh", "-c"]

# Default command: run our start script which expands $PORT and execs uvicorn
CMD ["./start.sh"]
