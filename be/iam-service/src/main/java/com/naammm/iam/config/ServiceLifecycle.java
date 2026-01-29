package com.naammm.iam.config;

import java.net.InetAddress;
import java.util.Collections;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import com.google.common.net.HostAndPort;
import com.orbitz.consul.Consul;
import com.orbitz.consul.model.agent.ImmutableRegistration;
import com.orbitz.consul.model.catalog.ImmutableServiceWeights;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class ServiceLifecycle {

  private static final Logger LOGGER = Logger.getLogger(ServiceLifecycle.class.getName());

  private String instanceId;

  private Consul consulClient;

  @ConfigProperty(name = "quarkus.application.name")
  String appName;
  @ConfigProperty(name = "quarkus.application.version")
  String appVersion;

  @ConfigProperty(name = "quarkus.profile", defaultValue = "dev")
  String profile;

  @ConfigProperty(name = "quarkus.http.port")
  int httpPort;

  @ConfigProperty(name = "consul.host", defaultValue = "localhost")
  String consulHost;

  @ConfigProperty(name = "consul.port", defaultValue = "8500")
  int consulPort;

  @ConfigProperty(name = "service.registration.address", defaultValue = "localhost")
  String serviceAddress;

  void onStart(@Observes StartupEvent ev) {

    try {
      consulClient = Consul.builder()
              .withHostAndPort(HostAndPort.fromParts(consulHost, consulPort))
              .build();
    } catch (Exception e) {
      LOGGER.severe("Unable to connect to Consul at " + consulHost + ":" + consulPort + " - " + e.getMessage());
      return;
    }

    if (consulClient == null) {
      LOGGER.severe("Inject Consul failed......");
      return;
    }
    LOGGER.info("The ServiceLifecycle is starting...");
    try {
      ScheduledExecutorService executorService = Executors
              .newSingleThreadScheduledExecutor();
      executorService.schedule(() -> {
        try {
          // Generate a unique instance ID using hostname, port, and timestamp
          // This ensures uniqueness without depending on counting existing instances
          String hostname = serviceAddress;
          if ("localhost".equals(serviceAddress)) {
            try {
              hostname = InetAddress.getLocalHost().getHostName();
            } catch (Exception lookupException) {
              LOGGER.warning("Could not resolve container hostname, falling back to 'localhost': " + lookupException.getMessage());
            }
          }
          long timestamp = System.currentTimeMillis();
          instanceId = String.format("%s-%s-%d-%d", appName, hostname, httpPort, timestamp);
          
          ImmutableRegistration registration = ImmutableRegistration.builder()
                  .id(instanceId)
                  .name(appName)
                  .address(serviceAddress)
                  .port(httpPort)
                  .putMeta("version", appVersion)
                  .tags(Collections.singletonList("hpi"))
                  .serviceWeights(ImmutableServiceWeights.builder().passing(1).warning(5).build())
                  .build();
          consulClient.agentClient().register(registration);
          LOGGER.info("Instance registered: id=" + registration.getId());
        } finally {
          executorService.shutdown();
        }
      }, 5000, TimeUnit.MILLISECONDS);
    } catch (Exception e) {
      LOGGER.severe("ServiceLifecycle " + e.getMessage());

    }
  }

  void onStop(@Observes ShutdownEvent ev) {

    if (consulClient == null) {
      LOGGER.info("consulClient is null, can not de-registered...");
      return;
    }
    if(instanceId != null){
      consulClient.agentClient().deregister(instanceId);
      LOGGER.info("Instance de-registered: id=" + instanceId);
    }

  }
}
