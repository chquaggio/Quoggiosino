FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt
RUN pip install "psycopg[binary]"

COPY . /app

EXPOSE 5000

CMD ["python", "app.py"]

