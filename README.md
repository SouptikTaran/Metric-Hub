# Monitoring and Logging Stack with Prometheus, Grafana, and Loki

This setup uses Docker containers to run Prometheus for metrics collection, Grafana for data visualization and dashboards, and Loki for log aggregation. It enables comprehensive monitoring and observability for applications.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

## Services

- **Prometheus**: Metrics collection and monitoring system.
- **Grafana**: Visualization tool for metrics and logs.
- **Loki**: Log aggregation system for collecting and querying logs.

---

## Running the Setup

### 1. Start Prometheus

To start Prometheus, ensure you have a properly configured `docker-compose.yml` file. Use the following command:

```bash
docker compose up -d
```

Prometheus will run as a service in detached mode as defined in your docker-compose.yml file.

### 2.Start Grafana
To run Grafana as a Docker container, use:

```bash
docker run -d -p 3000:3000 --name=grafana grafana/grafana-oss
```

Access Grafana at http://localhost:3000.
Default login credentials:
Username: admin
Password: admin (you will be prompted to change it on first login).

### 3. Start Loki for Log Aggregation
To start Loki, run the following command:

```bash
docker run -d --name=loki -p 3100:3100 grafana/loki
```

## Connecting Services in Grafana

#### Adding a Data Source

1. Navigate to the Grafana UI at [http://localhost:3000](http://localhost:3000).
2. Log in with the default credentials (if not already changed).
3. Go to **Configuration** -> **Data Sources** -> **Add data source**.
4. Add Prometheus and Loki as data sources by providing the respective URLs:
   - Prometheus: `http://<prometheus-container>:9090`
   - Loki: `http://<loki-container>:3100`

#### Creating Dashboards

1. Use the **+** icon in the left sidebar and select **Dashboard**.
2. Add panels to visualize metrics from Prometheus or logs from Loki.


## Troubleshooting

- **Port Conflicts**: Make sure the ports `3000` (Grafana), `9090` (Prometheus), and `3100` (Loki) are available.
- **Data Not Displayed in Grafana**: Ensure that Prometheus and Loki are correctly configured and running. Verify data source configurations in Grafana.
