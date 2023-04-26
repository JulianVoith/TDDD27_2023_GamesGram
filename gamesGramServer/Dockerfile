# Base Image
FROM python:3.10-slim


# set working directory
WORKDIR /usr/src/app

# add and install requirements
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip3 install -r requirements.txt

# add app
COPY . /usr/src/app

# run server
CMD gunicorn -b 0.0.0.0:5000 --workers 1 --threads 100 server:app