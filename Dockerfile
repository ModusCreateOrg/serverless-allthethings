FROM amazonlinux:2.0.20190228

# Install epel (to allow yum)
RUN amazon-linux-extras install epel
RUN yum -y update

# Install tar
RUN yum install -y tar.x86_64 xz

# Install node 8.10.0 and npm 6.9.0
ENV NODE_VERSION 8.10.0
ENV NODE_DIR /usr/local/node
ENV NODE_PATH "${NODE_DIR}/v${NODE_VERSION}"
ENV NODE_PATH_BIN "${NODE_PATH}/bin"
ENV PATH "${NODE_PATH_BIN}:${PATH}"

RUN mkdir -p "${NODE_DIR}"
RUN curl "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" | tar -xJ -C "${NODE_DIR}"
RUN mv "${NODE_DIR}/node-v${NODE_VERSION}-linux-x64" "${NODE_PATH}"

RUN npm install -g npm@6.9.0

# Install python and pip
RUN yum install -y python3

# Install aws cli
RUN python3 -m pip install awscli

# Install gzip
RUN yum install -y zip

# Install gzip
RUN yum install -y gzip

# Install brotli
RUN yum install -y brotli

# Clean up
RUN yum clean all

# Set defaults
ENV PORT 80
EXPOSE 80
WORKDIR /opt/serverless-allthethings
CMD ["npm", "start"]
