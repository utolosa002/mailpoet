<?php

namespace MailPoet\Doctrine;

use MailPoet\Config\Env;
use MailPoetVendor\Doctrine\DBAL\Connection;
use MailPoetVendor\Doctrine\ORM\Configuration;
use MailPoetVendor\Doctrine\ORM\EntityManager;
use MailPoetVendor\Doctrine\ORM\Events;

class EntityManagerFactory {

  /** @var Connection */
  private $connection;

  /** @var Configuration */
  private $configuration;

  function __construct(Connection $connection, Configuration $configuration) {
    $this->connection = $connection;
    $this->configuration = $configuration;
  }

  function createEntityManager() {
    $entity_manager = EntityManager::create($this->connection, $this->configuration);
    $this->setupTablePrefix($entity_manager);
    return $entity_manager;
  }

  private function setupTablePrefix(EntityManager $entity_manager) {
    $entity_manager->getEventManager()->addEventListener(
      Events::loadClassMetadata,
      new TablePrefixListener(Env::$db_prefix)
    );
  }
}
