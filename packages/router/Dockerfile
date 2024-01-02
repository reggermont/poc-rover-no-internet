FROM debian:stable-slim as installer

# install script needs curl or wget
RUN apt update && apt install -y curl

ARG ROUTER_VERSION=1.35.0
ARG ROVER_VERSION=0.22.0

RUN curl -sSL https://rover.apollo.dev/nix/v$ROVER_VERSION | sh
RUN curl -sSL https://router.apollo.dev/download/nix/v$ROUTER_VERSION | sh

FROM debian:stable-slim as runner

COPY --from=installer /root/.rover/bin/rover /root/.rover/bin/rover
ENV PATH="/root/.rover/bin:${PATH}"

COPY --from=installer ./router /root/.router/bin/router
ENV PATH="/root/.router/bin:${PATH}"

RUN apt update && apt install -y ca-certificates curl && rm -rf /var/lib/apt/lists/* && apt-get clean

EXPOSE 4500
WORKDIR /app/packages/sx-router
